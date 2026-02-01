"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { onboardingSchema } from "@/schemas/onboarding-schema";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { companySize } from "@/lib/dropdowns/company-size";
import { workLimitations } from "@/lib/dropdowns/company-limitations";
import { companyData } from "@/lib/dropdowns/company-data";
import { companyPriorities } from "@/lib/dropdowns/company-priorities";

const bussinessStages = [
  {
    key: 1,
    value: "introduction",
    label: "Introduction",
  },
  {
    key: 2,
    value: "growth",
    label: "Growth",
  },
  {
    key: 3,
    value: "maturity",
    label: "Maturity",
  },
  {
    key: 4,
    value: "decline",
    label: "Decline",
  },
];

export default function Page() {
  const router = useRouter();
  const params = useSearchParams();
  const step = Number(params.get("step") || 1);

  const [businessName, setBusinessName] = useState("");
  const [description, setDescription] = useState("");
  const [size, setSize] = useState("");

  const form = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      businessName: "",
      businessDescription: "",
      industry: "",
      companySize: "",
      valueProposition: "",
      businessStage: "",
    },
  });

  function next() {
    router.push(`/onboarding?step=${step + 1}`);
  }

  function back() {
    router.push(`/onboarding?step=${step - 1}`);
  }

  async function onSubmit() {
    await fetch("/api/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        businessId: crypto.randomUUID(),
        businessDescription: description,
      }),
    });
    router.push("/");
  }

  return (
    <div className="w-full h-screen justify-items-center place-content-center bg-zinc-50">
      <Card className="w-full max-w-7xl">
        <CardHeader>
          <CardTitle className="text-center">
            Welcome to Lean Consulting AI
          </CardTitle>
          <CardDescription className="text-center">
            Let's get started with your Lean transformation journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="form-onboarding" onSubmit={form.handleSubmit(onSubmit)}>
            {step === 1 && (
              <FieldGroup className="gap-3">
                {/* Business Name */}
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Business Name</FieldLabel>
                      <Input
                        {...field}
                        id="form-onboarding-name"
                        placeholder="Provide youu business Name"
                      />
                    </Field>
                  )}
                />
                {/* Company Size */}
                <Controller
                  name="size"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Company Size</FieldLabel>
                      <div className="grid grid-cols-3 gap-4 mt-2">
                        {companySize.map((item) => {
                          const active = field.value === item.value;

                          return (
                            <button
                              key={item.key}
                              type="button"
                              onClick={() => field.onChange(item.value)}
                              className={`
                                col-span-1 rounded-xl border p-4 text-center transition
                                ${
                                  active
                                    ? "bg-blue-500 text-white border-blue-600 shadow-md"
                                    : "bg-gray-100 border-slate-300 hover:bg-blue-100"
                                }
                            `}
                            >
                              <p className="font-semibold">{item.label}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.legend}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </Field>
                  )}
                />
                {/* Operations */}
                <Controller
                  name="operations"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>How do you operate?</FieldLabel>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Bussiness Stage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="product">Product-based</SelectItem>
                          <SelectItem value="service">Service-based</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
                {/* Work */}
                <Controller
                  name="industry"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Industry</FieldLabel>
                      <Textarea placeholder="Example: one order delivered, one client served" />
                    </Field>
                  )}
                />
              </FieldGroup>
            )}
            {step === 2 && (
              <FieldGroup className="gap-3">
                {/* Muda Diagnostic */}
                <Controller
                  name="mudaDiagnostic"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>
                        Where does work usually get stuck or slow?
                      </FieldLabel>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Value" />
                        </SelectTrigger>
                        <SelectContent>
                          {workLimitations.map((item) => (
                            <SelectItem 
                                key={item.key}
                                value={item.value}
                            >
                                {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
                {/* Data Handling */}
                <Controller
                  name="dataHandling"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Where is your data today?</FieldLabel>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Value" />
                        </SelectTrigger>
                        <SelectContent>
                          {companyData.map((item) => (
                            <SelectItem
                                key={item.key}
                                value={item.value}
                            >
                                {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
                <Controller
                  name="process"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>
                        Describe one process that feels inefficient or
                        frustrating.
                      </FieldLabel>
                      <Textarea {...field} id="form-onboarding-process" />
                    </Field>
                  )}
                />
              </FieldGroup>
            )}
            {step === 3 && (
              <FieldGroup className="gap-3">
                <Controller
                  name="businessName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>What matters most right now?</FieldLabel>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Where is your data today?" />
                        </SelectTrigger>
                        <SelectContent>
                        {companyPriorities.map((item) => (
                            <SelectItem
                                key={item.key}
                                value={item.value}
                            >
                                {item.label}
                            </SelectItem>
                        ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
                <Controller
                  name="businessName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>
                        Do you track customer complaints or issues?
                      </FieldLabel>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Where is your data today?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="time">Yes</SelectItem>
                          <SelectItem value="quality">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
              </FieldGroup>
            )}
            {step === 4 && (
              <FieldGroup className="gap-3">
                <Controller
                  name="businessName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>
                        What kind of evidence can you share during missions?
                      </FieldLabel>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Where is your data today?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="screenshots">
                            Screenshots
                          </SelectItem>
                          <SelectItem value="photo">Photos</SelectItem>
                          <SelectItem value="files">Files</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
              </FieldGroup>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex w-full justify-between">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={back}>
              Back
            </Button>
          )}

          {step < 4 && (
            <Button type="button" onClick={next} className="bg-blue-600">
              Next
            </Button>
          )}

          {step === 4 && (
            <Button
              type="submit"
              form="form-onboarding"
              className="bg-green-600"
            >
              Start First Mission
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
