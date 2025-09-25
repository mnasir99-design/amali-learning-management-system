import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Edit, X } from "lucide-react";

const courseFormSchema = z.object({
  title: z.string().min(1, "Course title is required"),
  description: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
});

type CourseFormData = z.infer<typeof courseFormSchema>;

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CourseModal({ isOpen, onClose }: CourseModalProps) {
  const [units, setUnits] = useState([{ id: 1, title: "Unit 1: Introduction" }]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      subject: "",
    },
  });

  const createCourseMutation = useMutation({
    mutationFn: async (data: CourseFormData) => {
      return await apiRequest("POST", "/api/courses", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Course created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      onClose();
      form.reset();
      setUnits([{ id: 1, title: "Unit 1: Introduction" }]);
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create course",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CourseFormData) => {
    createCourseMutation.mutate(data);
  };

  const addUnit = () => {
    const newId = Math.max(...units.map(u => u.id)) + 1;
    setUnits([...units, { id: newId, title: `Unit ${newId}: New Unit` }]);
  };

  const removeUnit = (id: number) => {
    if (units.length > 1) {
      setUnits(units.filter(u => u.id !== id));
    }
  };

  const updateUnitTitle = (id: number, title: string) => {
    setUnits(units.map(u => u.id === id ? { ...u, title } : u));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Create New Course
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              data-testid="button-close-modal"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Advanced Algebra" 
                        {...field}
                        data-testid="input-course-title"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-subject">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="mathematics" data-testid="subject-mathematics">Mathematics</SelectItem>
                        <SelectItem value="science" data-testid="subject-science">Science</SelectItem>
                        <SelectItem value="english" data-testid="subject-english">English</SelectItem>
                        <SelectItem value="history" data-testid="subject-history">History</SelectItem>
                        <SelectItem value="art" data-testid="subject-art">Art</SelectItem>
                        <SelectItem value="music" data-testid="subject-music">Music</SelectItem>
                        <SelectItem value="physical-education" data-testid="subject-pe">Physical Education</SelectItem>
                        <SelectItem value="computer-science" data-testid="subject-cs">Computer Science</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      rows={4} 
                      placeholder="Course description..." 
                      {...field}
                      data-testid="textarea-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel className="text-sm font-medium text-gray-700 mb-2 block">
                Course Structure
              </FormLabel>
              <div className="border border-gray-300 rounded-lg p-4">
                <div className="space-y-3">
                  {units.map((unit) => (
                    <div 
                      key={unit.id} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded"
                    >
                      <Input
                        value={unit.title}
                        onChange={(e) => updateUnitTitle(unit.id, e.target.value)}
                        className="flex-1 mr-2 bg-transparent border-0 font-medium"
                        data-testid={`input-unit-title-${unit.id}`}
                      />
                      <div className="flex items-center space-x-2">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          data-testid={`button-edit-unit-${unit.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {units.length > 1 && (
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeUnit(unit.id)}
                            data-testid={`button-remove-unit-${unit.id}`}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full border-2 border-dashed border-gray-300 hover:border-primary-300 hover:text-primary-600"
                    onClick={addUnit}
                    data-testid="button-add-unit"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Unit
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-primary-600 hover:bg-primary-700"
                disabled={createCourseMutation.isPending}
                data-testid="button-create-course"
              >
                {createCourseMutation.isPending ? "Creating..." : "Create Course"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
