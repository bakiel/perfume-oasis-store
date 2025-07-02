-- Function to increment promotion usage count
CREATE OR REPLACE FUNCTION increment_promotion_usage(promotion_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE promotions
  SET usage_count = usage_count + 1
  WHERE id = promotion_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;