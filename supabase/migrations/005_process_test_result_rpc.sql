
CREATE OR REPLACE FUNCTION process_test_result(
  p_user_id UUID,
  p_type_id INT,
  p_file_path TEXT,
  p_cost NUMERIC,
  p_notes TEXT,
  p_created_at TIMESTAMP WITH TIME ZONE
) RETURNS JSONB AS $$
DECLARE
  v_current_points NUMERIC;
  v_current_tier_id INT;
  v_pcr NUMERIC;
  v_points_to_add NUMERIC;
  v_new_points NUMERIC;
  v_max_points NUMERIC;
  v_current_class CHAR(1);
  v_next_tier_id INT;
  v_next_class CHAR(1);
  v_result JSONB;
BEGIN
  -- 1. Insert the test record
  INSERT INTO test (user_id, type_id, file_path, cost, notes, "createdAt")
  VALUES (p_user_id, p_type_id, p_file_path, p_cost, p_notes, p_created_at);

  -- 2. Get user's current status and tier info
  SELECT u.points, u.tier_id, t.pcr, t.max_points, t.class
  INTO v_current_points, v_current_tier_id, v_pcr, v_max_points, v_current_class
  FROM "user" u
  JOIN tier t ON u.tier_id = t.id
  WHERE u.id = p_user_id;

  -- 3. Calculate points to add
  IF v_pcr IS NULL OR v_pcr = 0 THEN
    v_points_to_add := 0;
  ELSE
    v_points_to_add := p_cost / v_pcr;
  END IF;

  v_new_points := COALESCE(v_current_points, 0) + v_points_to_add;

  -- 4. Update user points and wallet
  UPDATE "user"
  SET points = v_new_points,
      wallet = COALESCE(wallet, 0) + v_points_to_add
  WHERE id = p_user_id;

  -- 5. Check for tier upgrade
  IF v_max_points IS NOT NULL AND v_new_points >= v_max_points THEN
    -- Find the next tier in order of class (A, B, C...)
    SELECT id, class
    INTO v_next_tier_id, v_next_class
    FROM tier
    WHERE class > v_current_class
    ORDER BY class ASC
    LIMIT 1;

    IF v_next_tier_id IS NOT NULL THEN
      UPDATE "user"
      SET tier_id = v_next_tier_id
      WHERE id = p_user_id;
      
      v_result := jsonb_build_object(
        'success', true,
        'points_added', v_points_to_add,
        'new_points', v_new_points,
        'tier_upgraded', true,
        'old_tier_id', v_current_tier_id,
        'new_tier_id', v_next_tier_id
      );
    ELSE
      v_result := jsonb_build_object(
        'success', true,
        'points_added', v_points_to_add,
        'new_points', v_new_points,
        'tier_upgraded', false
      );
    END IF;
  ELSE
    v_result := jsonb_build_object(
      'success', true,
      'points_added', v_points_to_add,
      'new_points', v_new_points,
      'tier_upgraded', false
    );
  END IF;

  RETURN v_result;

EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM
  );
END;
$$ LANGUAGE plpgsql;
