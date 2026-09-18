"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateAiCaptionAction, createPostAction } from "./actions";
import { Loader2, Wand2 } from "lucide-react";

export function CreatePostForm() {
  const [caption, setCaption] = useState("");
  const [productContext, setProductContext] = useState("");
  const [language, setLanguage] = useState<'en' | 'bn' | 'banglish'>('en');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGenerate = async () => {
    if (!productContext) return;
    setIsGenerating(true);
    try {
      const generated = await generateAiCaptionAction(productContext, language);
      setCaption(generated);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      await createPostAction(formData);
      setCaption("");
      setProductContext("");
      (e.target as HTMLFormElement).reset();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Product Context (for AI)</Label>
        <div className="flex gap-2">
          <Input 
            value={productContext}
            onChange={(e) => setProductContext(e.target.value)}
            placeholder="e.g. Red Cotton Saree"
          />
          <Select value={language} onValueChange={(val: any) => setLanguage(val)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="bn">Bangla</SelectItem>
              <SelectItem value="banglish">Banglish</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button 
          type="button" 
          variant="secondary" 
          onClick={handleGenerate}
          disabled={isGenerating || !productContext}
          className="w-full"
        >
          {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
          AI Caption Suggestion
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="caption">Caption</Label>
        <Input 
          id="caption"
          name="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write or generate a caption..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mediaUrl">Media URL (optional)</Label>
        <Input 
          id="mediaUrl"
          name="mediaUrl"
          placeholder="https://..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select name="status" defaultValue="draft">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Saving..." : "Save Post"}
      </Button>
    </form>
  );
}
