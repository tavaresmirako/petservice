-- Create storage bucket for pet photos
INSERT INTO storage.buckets (id, name, public) VALUES ('pet-photos', 'pet-photos', true);

-- Storage policies for pet photos
CREATE POLICY "Anyone can view pet photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'pet-photos');

CREATE POLICY "Users can upload pet photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'pet-photos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own pet photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'pet-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own pet photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'pet-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add size column to pets table
ALTER TABLE public.pets ADD COLUMN size TEXT CHECK (size IN ('pequeno', 'medio', 'grande'));