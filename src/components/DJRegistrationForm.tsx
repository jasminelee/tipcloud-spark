
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Form validation schema
const djFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  genre: z.string().min(1, "Genre is required"),
  soundcloud_url: z.string().url("Must be a valid URL"),
  wallet_address: z.string().min(10, "Wallet address must be valid"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  image_url: z.string().url("Must be a valid image URL").optional(),
});

type DJFormValues = z.infer<typeof djFormSchema>;

const DJRegistrationForm = () => {
  const navigate = useNavigate();

  const form = useForm<DJFormValues>({
    resolver: zodResolver(djFormSchema),
    defaultValues: {
      name: "",
      genre: "",
      soundcloud_url: "https://soundcloud.com/",
      wallet_address: "",
      bio: "",
      image_url: "https://images.unsplash.com/photo-1571741140674-8949ca7df2a7?q=80&w=1000&auto=format&fit=crop",
    },
  });

  const onSubmit = async (data: DJFormValues) => {
    try {
      // Get current authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to register as a DJ");
        navigate("/connect");
        return;
      }

      // Create DJ profile
      const { error } = await supabase
        .from('dj_profiles')
        .insert({
          id: user.id,
          ...data,
        });

      if (error) throw error;

      toast.success("Successfully registered as a DJ!");
      navigate(`/dj/${user.id}`);
    } catch (error) {
      console.error("Error registering as DJ:", error);
      toast.error("Failed to register. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>DJ Name</FormLabel>
              <FormControl>
                <Input placeholder="Your DJ name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="genre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Music Genre</FormLabel>
              <FormControl>
                <Input placeholder="House, Techno, EDM, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="soundcloud_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SoundCloud Profile URL</FormLabel>
              <FormControl>
                <Input placeholder="https://soundcloud.com/your-username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="wallet_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bitcoin/SBTC Wallet Address</FormLabel>
              <FormControl>
                <Input placeholder="Your Bitcoin wallet address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Image URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/your-image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell your fans about yourself and your music" 
                  {...field} 
                  className="min-h-[120px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-soundcloud hover:bg-soundcloud-dark text-white">
          Register as DJ
        </Button>
      </form>
    </Form>
  );
};

export default DJRegistrationForm;
