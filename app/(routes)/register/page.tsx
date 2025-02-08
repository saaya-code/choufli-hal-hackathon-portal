"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

// Define the schema for each team member
const teamMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(8, "Phone number must be at least 8 characters."),
})

// Define the schema for the entire form
const formSchema = z.object({
  teamName: z.string().min(2, "Team name must be at least 2 characters."),
  teamSize: z.string(),
  experience: z.string().min(10, "Please tell us a bit more about your experience."),
  teamMembers: z.array(teamMemberSchema),
})

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const totalSteps = 3

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamName: "",
      teamSize: "1",
      experience: "",
      teamMembers: [{ name: "", email: "", phone: "" }],
    },
  })

  const teamSize = Number.parseInt(form.watch("teamSize") || "1")

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values)
    // Here you would typically send the data to your backend
    alert("Registration submitted successfully!")
  }

  const nextStep = async () => {
    const fields =
      step === 1
        ? ["teamName", "teamSize"]
        : step === 2
          ? Array.from({ length: teamSize }, (_, i) => [
              `teamMembers.${i}.name`,
              `teamMembers.${i}.email`,
              `teamMembers.${i}.phone`,
            ]).flat()
          : ["experience"]

    const isValid = await form.trigger(fields as (keyof z.infer<typeof formSchema>)[])
    if (isValid) setStep(Math.min(step + 1, totalSteps))
  }

  const prevStep = () => setStep(Math.max(step - 1, 1))

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background py-20">
      <div className="container max-w-2xl">
        <div className="text-center mb-12 relative">
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-32 h-32 opacity-20">
            <Image src="/fenjen.png" alt="Coffee cup" fill className="object-contain" />
          </div>
          <div className="relative w-48 h-48 mx-auto mb-8">
            <Image src="/logo.png" alt="Choufli Hal Bootcamp 2.0" fill className="object-contain" />
          </div>
          <h1 className="text-4xl font-bold text-primary mb-2">Join the Adventure</h1>
          <p className="text-muted-foreground">Register for an unforgettable Ramadan hackathon experience</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div key={i} className={`w-1/3 h-2 rounded-full ${i + 1 <= step ? "bg-primary" : "bg-gray-200"}`} />
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Step {step} of {totalSteps}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {step === 1 && (
                <>
                  <FormField
                    control={form.control}
                    name="teamName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your team name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="teamSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team Size</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select team size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">Solo (1 person)</SelectItem>
                            <SelectItem value="2">2 people</SelectItem>
                            <SelectItem value="3">3 people</SelectItem>
                            <SelectItem value="4">4 people</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {step === 2 && (
                <div className="space-y-8">
                  {Array.from({ length: teamSize }).map((_, index) => (
                    <div key={index} className="space-y-4">
                      <h3 className="text-lg font-semibold">Team Member {index + 1}</h3>
                      <FormField
                        control={form.control}
                        name={`teamMembers.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`teamMembers.${index}.email`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="john@example.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`teamMembers.${index}.phone`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+216" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
              )}

              {step === 3 && (
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Previous Experience</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your team's coding experience and why you want to join the hackathon"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Brief description of your team&apos;s technical background and interests
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="flex justify-between">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                  </Button>
                )}
                {step < totalSteps ? (
                  <Button type="button" onClick={nextStep} className="ml-auto">
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" className="ml-auto">
                    Submit Registration
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

