"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Copy, Plus } from "lucide-react";
import { successToast } from './Toast';
import { runAgent } from '@/actions/agent.action';

interface PostData {
  title: string;
  description: string;
  keywords: string[];
}

interface PostDialogProps {
  trigger: React.ReactNode
}

export default function PostDialog({ trigger}: PostDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [output, setOutput] = useState<string|undefined>('');
  const [formData, setFormData] = useState<PostData>({
    title: '',
    description: '',
    keywords: []
  });
  const [currentKeyword, setCurrentKeyword] = useState('');



const handleAddKeyword = () => {
    if (currentKeyword.trim() && !formData.keywords.includes(currentKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, currentKeyword.trim()]
      }));
      setCurrentKeyword('');
    }
  };


const handleRemoveKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  

  const handleKeywordKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.title.trim() || !formData.description.trim()) return;
      
      setIsSubmitting(true);
      setOutput('');
      
      try {
          const result = await runAgent(formData);
          
          if (result?.success) {
              setOutput(result.result);
              successToast("AI created post successfully!");
          } else {
              setOutput(result.error || 'Error occurred while processing your request.');
          }
      } catch (error) {
          console.error('Error running agent:', error);
          setOutput('Error occurred while processing your request.');
      } finally {
          setIsSubmitting(false);
      }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output||"");
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };


  const resetForm = () => {
    setFormData({ title: '', description: '', keywords: [] });
    setCurrentKeyword('');
    setOutput('');
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <div onClick={() => setOpen(true)}>
        {trigger}
      </div>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-background border-border">
        <DialogHeader>
          <DialogTitle className="">Create New Post</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Fill in the details below to generate your post content.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Post Title
            </Label>
            <Input
              id="title"
              placeholder="Enter post title..."
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              className="bg-primary-foreground text-black placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500 rounded-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter post description..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              required
              className="bg-primary-foreground text-black placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500 rounded-sm resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords" className="font-medium">
              Keywords
            </Label>
            <div className="flex gap-2">
              <Input
                id="keywords"
                placeholder="Add a keyword..."
                value={currentKeyword}
                onChange={(e) => setCurrentKeyword(e.target.value)}
                onKeyPress={handleKeywordKeyPress}
                className="bg-primary-foreground text-black placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500 rounded-sm"
              />
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                onClick={handleAddKeyword}
                disabled={!currentKeyword.trim()}
                className="bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200 hover:text-slate-700 rounded-sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {formData.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.keywords.map((keyword, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="flex items-center gap-1 text-sm rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 px-2 py-1"
                  >
                    {keyword}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent text-slate-500 hover:text-slate-700"
                      onClick={() => handleRemoveKeyword(keyword)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting || !formData.title.trim() || !formData.description.trim()}
          >
            {isSubmitting ? 'Generating...' : 'Generate Post'}
          </Button>
        </form>

        {output && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-slate-700 text-sm font-medium">Generated Content</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="flex items-center gap-2 bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200 hover:text-slate-700 rounded-sm"
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
            </div>
            <div className="bg-slate-100 p-4 rounded-sm border border-slate-300">
              <pre className="whitespace-pre-wrap text-sm text-slate-900 font-mono">
                {output}
              </pre>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}