// components/ui/contact-form.tsx
'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2, Send, CheckCircle } from "lucide-react";

// Single comprehensive schema that includes all possible fields
const contactFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  message: z.string().min(10, "Please provide more details"),
  // Optional fields for different variants
  subject: z.string().optional(),
  projectType: z.string().optional(),
  budget: z.string().optional(),
})
.refine((data) => {
  // This will be handled by the component logic, not schema validation
  return true;
}, {
  message: "Invalid form data"
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  variant?: 'tutoring' | 'portfolio' | 'general';
  title?: string;
  subtitle?: string;
  endpoint?: string;
  className?: string;
  showCard?: boolean;
  onSuccess?: () => void;
  submitText?: string;
}

const ContactForm = ({
  variant = 'general',
  title = "Get In Touch",
  subtitle = "Let's discuss your project",
  endpoint = '/api/contact',
  className = "",
  showCard = true,
  onSuccess,
  submitText = "Send Message"
}: ContactFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
      subject: "",
      projectType: "",
      budget: "",
    }
  });

  // Custom validation before submission
  const validateFormData = (data: ContactFormData): boolean => {
    switch (variant) {
      case 'tutoring':
        if (!data.subject || data.subject.trim().length === 0) {
          form.setError('subject', { 
            type: 'manual', 
            message: 'Please specify the subject you need help with' 
          });
          return false;
        }
        break;
      case 'portfolio':
        if (!data.projectType || data.projectType.trim().length === 0) {
          form.setError('projectType', { 
            type: 'manual', 
            message: 'Please specify the type of project' 
          });
          return false;
        }
        break;
    }
    return true;
  };

  const onSubmit = async (values: ContactFormData) => {
    // Validate variant-specific required fields
    if (!validateFormData(values)) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...values, formVariant: variant }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setIsSubmitted(true);
      form.reset();
      
      toast.success("Message sent successfully!", {
        description: "I'll get back to you within 24 hours.",
      });

      onSuccess?.();

    } catch (error) {
      console.error('Form submission error:', error);

      toast.error("Message failed to send", {
        description: "The contact form is currently experiencing issues. Please email me at cameronbrady1527@gmail.com or text me at (845) 264-3972 while I work on fixing this. Sorry for the inconvenience!",
        duration: 10000, // Show for 10 seconds so users have time to read
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderVariantFields = () => {
    switch (variant) {
      case 'tutoring':
        return (
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject(s) Needed</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Calculus, Computer Science, Physics" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      
      case 'portfolio':
        return (
          <>
            <FormField
              control={form.control}
              name="projectType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Web Development, Web Scraping, Data Analysis" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Range (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., $5,000 - $10,000" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      
      default:
        return null;
    }
  };

  const renderMessagePlaceholder = () => {
    switch (variant) {
      case 'tutoring':
        return "Share your current challenges, learning goals, and any specific areas you'd like to focus on...";
      case 'portfolio':
        return "Tell me about your project, timeline, and any specific requirements...";
      default:
        return "Tell me more about what you're looking for...";
    }
  };

  const SuccessContent = () => (
    <Card className={`shadow-lg relative ${className}`} style={{ zIndex: 20 }}>
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
        >
          <CheckCircle className="h-8 w-8 text-green-600" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
        <p className="text-gray-600 mb-6">
          Thanks for reaching out. I'll review your message and get back to you within 24 hours.
        </p>
        <Button 
          variant="outline" 
          onClick={() => setIsSubmitted(false)}
        >
          Send Another Message
        </Button>
      </CardContent>
    </Card>
  );

  const FormContent = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Cameron" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Brady" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="cameronbrady1527@gmail.com" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="(845) 264-3972" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {renderVariantFields()}

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={renderMessagePlaceholder()}
                  className="min-h-[100px]"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <motion.div
          whileHover={isSubmitting ? {} : { scale: 1.02 }}
          whileTap={isSubmitting ? {} : { scale: 0.98 }}
        >
          <Button 
            type="submit" 
            size="lg" 
            className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {submitText}
              </>
            )}
          </Button>
        </motion.div>

        <p className="text-sm text-gray-600 text-center pt-2">
          I'll respond within 24 hours to discuss your needs and schedule a consultation.
        </p>
      </form>
    </Form>
  );

  if (isSubmitted) {
    return <SuccessContent />;
  }

  if (!showCard) {
    return (
      <div className={className}>
        {title && (
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">{title}</h3>
            {subtitle && <p className="text-gray-600">{subtitle}</p>}
          </div>
        )}
        <FormContent />
      </div>
    );
  }

  return (
    <Card className={`shadow-lg hover:shadow-xl transition-shadow duration-300 relative ${className}`} style={{ zIndex: 20 }}>
      <CardHeader>
        <CardTitle className="text-2xl text-center">{title}</CardTitle>
        {subtitle && <p className="text-center text-gray-600">{subtitle}</p>}
      </CardHeader>
      <CardContent>
        <FormContent />
      </CardContent>
    </Card>
  );
};

export { ContactForm };