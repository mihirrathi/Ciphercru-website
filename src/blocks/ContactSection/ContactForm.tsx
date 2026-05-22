'use client'

import type {
  FormFieldBlock,
  Form as FormType,
  SelectField,
} from '@payloadcms/plugin-form-builder/types'
import type { LucideIcon } from 'lucide-react'

import {
  Building2,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Mail,
  MessageSquare,
  Pencil,
  Phone,
  Send,
  ShieldCheck,
  User,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'

import RichText from '@/components/RichText'
import { Checkbox } from '@/components/ui/checkbox'
import { getClientSideURL } from '@/utilities/getURL'
import { cn } from '@/utilities/ui'

type ContactFormProps = {
  form: FormType
  showAgreement?: boolean | null
  privacyPolicyUrl?: string | null
  termsUrl?: string | null
  safetyNote?: string | null
}

const iconForField = (name: string): LucideIcon | null => {
  const n = name.toLowerCase()
  if (n.includes('fullname') || n === 'name' || n.includes('firstname') || n.includes('lastname'))
    return User
  if (n.includes('email')) return Mail
  if (n.includes('phone') || n.includes('mobile') || n.includes('tel')) return Phone
  if (n.includes('company') || n.includes('organization') || n.includes('organisation'))
    return Building2
  if (n.includes('subject') || n.includes('topic')) return MessageSquare
  if (n.includes('message') || n.includes('comment') || n.includes('inquiry')) return Pencil
  return null
}

const labelClass = 'text-sm font-semibold text-gray-900 mb-1.5 flex items-center gap-1'
const inputBaseClass =
  'w-full h-12 pl-11 pr-4 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-60'

const FieldShell: React.FC<{
  name: string
  label?: string
  required?: boolean
  width?: number
  Icon?: LucideIcon | null
  children: React.ReactNode
  fullRow?: boolean
}> = ({ name, label, required, width, Icon, children, fullRow }) => {
  const colClass = fullRow
    ? 'col-span-2'
    : width && width <= 50
    ? 'col-span-2 md:col-span-1'
    : 'col-span-2'

  return (
    <div className={colClass}>
      {label && (
        <label htmlFor={name} className={labelClass}>
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

export const ContactForm: React.FC<ContactFormProps> = ({
  form,
  showAgreement,
  privacyPolicyUrl,
  termsUrl,
  safetyNote,
}) => {
  const formMethods = useForm<Record<string, unknown>>({
    defaultValues: form.fields as unknown as Record<string, unknown>,
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const router = useRouter()

  const onSubmit = useCallback(
    (data: Record<string, unknown>) => {
      const submit = async () => {
        setError(undefined)
        setIsLoading(true)
        const dataToSend = Object.entries(data).map(([name, value]) => ({ field: name, value }))

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ form: form.id, submissionData: dataToSend }),
          })
          const res = await req.json()
          setIsLoading(false)
          if (req.status >= 400) {
            setError(res.errors?.[0]?.message || 'Something went wrong. Please try again.')
            return
          }
          setHasSubmitted(true)
          if (form.confirmationType === 'redirect' && form.redirect?.url) {
            router.push(form.redirect.url)
          }
        } catch {
          setIsLoading(false)
          setError('Something went wrong. Please try again.')
        }
      }
      void submit()
    },
    [form.id, form.confirmationType, form.redirect, router],
  )

  if (hasSubmitted && form.confirmationType === 'message') {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <div className="w-14 h-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h4 className="text-xl font-semibold text-gray-900 mb-2">Thanks for reaching out!</h4>
        {form.confirmationMessage && (
          <RichText data={form.confirmationMessage} enableGutter={false} />
        )}
      </div>
    )
  }

  return (
    <FormProvider {...formMethods}>
      <form id={form.id} onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-2 gap-x-5 gap-y-5">
          {(form.fields || []).map((field, index) => {
            const f = field as FormFieldBlock & {
              name: string
              label?: string
              required?: boolean
              width?: number
              defaultValue?: string
              placeholder?: string
            }
            const Icon = iconForField(f.name || '')
            const placeholder = (f as { placeholder?: string }).placeholder
            const key = `${f.name}-${index}`

            if (field.blockType === 'text' || field.blockType === 'email') {
              return (
                <FieldShell
                  key={key}
                  name={f.name}
                  label={f.label}
                  required={f.required}
                  width={f.width}
                  Icon={Icon}
                >
                  <input
                    id={f.name}
                    type={field.blockType === 'email' ? 'email' : 'text'}
                    defaultValue={f.defaultValue}
                    placeholder={placeholder || `Enter your ${(f.label || f.name).toLowerCase()}`}
                    className={cn(inputBaseClass, !Icon && 'pl-4')}
                    aria-invalid={errors[f.name] ? 'true' : 'false'}
                    suppressHydrationWarning
                    {...register(f.name, {
                      required: f.required,
                      ...(field.blockType === 'email'
                        ? { pattern: /^\S[^\s@]*@\S+$/ }
                        : {}),
                    })}
                  />
                  {errors[f.name] && (
                    <p className="mt-1.5 text-xs text-red-500">
                      Please enter a valid {(f.label || f.name).toLowerCase()}.
                    </p>
                  )}
                </FieldShell>
              )
            }

            if (field.blockType === 'textarea' || field.blockType === 'message') {
              return (
                <FieldShell
                  key={key}
                  name={f.name}
                  label={f.label}
                  required={f.required}
                  width={f.width}
                  Icon={Icon}
                  fullRow
                >
                  <div className="relative">
                    {Icon && (
                      <div className="pointer-events-none absolute top-3.5 left-4 text-gray-400">
                        <Icon className="h-4 w-4" />
                      </div>
                    )}
                    <textarea
                      id={f.name}
                      rows={5}
                      defaultValue={f.defaultValue}
                      placeholder={placeholder || 'Tell us about your project or inquiry…'}
                      className={cn(
                        'w-full pl-11 pr-4 py-3 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 resize-y',
                        !Icon && 'pl-4',
                      )}
                      suppressHydrationWarning
                      {...register(f.name, { required: f.required })}
                    />
                  </div>
                </FieldShell>
              )
            }

            if (field.blockType === 'select') {
              const sf = field as SelectField
              return (
                <FieldShell
                  key={key}
                  name={f.name}
                  label={f.label}
                  required={f.required}
                  width={f.width}
                  fullRow
                >
                  <Controller
                    control={control}
                    name={f.name}
                    defaultValue={sf.defaultValue}
                    rules={{ required: f.required }}
                    render={({ field: rhfField }) => (
                      <div className="relative">
                        {Icon && (
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                            <Icon className="h-4 w-4" />
                          </div>
                        )}
                        <select
                          id={f.name}
                          value={typeof rhfField.value === 'string' ? rhfField.value : ''}
                          onChange={(e) => rhfField.onChange(e.target.value)}
                          className={cn(
                            inputBaseClass,
                            'appearance-none pr-10 cursor-pointer',
                            !Icon && 'pl-4',
                            !rhfField.value && 'text-gray-400',
                          )}
                          suppressHydrationWarning
                        >
                          <option value="" disabled>
                            {placeholder || `Select a ${(f.label || 'option').toLowerCase()}`}
                          </option>
                          {(sf.options || []).map((opt) => (
                            <option key={opt.value} value={opt.value} className="text-gray-900">
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400">
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </div>
                    )}
                  />
                </FieldShell>
              )
            }

            if (field.blockType === 'checkbox') {
              return (
                <div key={key} className="col-span-2">
                  <Controller
                    control={control}
                    name={f.name}
                    defaultValue={(f as { defaultValue?: boolean }).defaultValue || false}
                    rules={{ required: f.required }}
                    render={({ field: rhfField }) => (
                      <label
                        htmlFor={f.name}
                        className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer"
                      >
                        <Checkbox
                          id={f.name}
                          checked={Boolean(rhfField.value)}
                          onCheckedChange={(c) => rhfField.onChange(Boolean(c))}
                          className="mt-0.5"
                        />
                        <span>
                          {f.label}
                          {f.required && <span className="text-red-500"> *</span>}
                        </span>
                      </label>
                    )}
                  />
                </div>
              )
            }

            return null
          })}

          {showAgreement && (
            <div className="col-span-2 pt-1">
              <Controller
                control={control}
                name="__agreement"
                defaultValue={false}
                rules={{ required: true }}
                render={({ field: rhfField }) => (
                  <label
                    htmlFor="__agreement"
                    className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer select-none"
                  >
                    <Checkbox
                      id="__agreement"
                      checked={Boolean(rhfField.value)}
                      onCheckedChange={(c) => rhfField.onChange(Boolean(c))}
                      className="mt-0.5"
                    />
                    <span>
                      I agree to the{' '}
                      <Link
                        href={privacyPolicyUrl || '/privacy-policy'}
                        className="text-brand font-medium hover:underline"
                      >
                        Privacy Policy
                      </Link>{' '}
                      and{' '}
                      <Link
                        href={termsUrl || '/terms-of-service'}
                        className="text-brand font-medium hover:underline"
                      >
                        Terms of Service
                      </Link>
                      .
                    </span>
                  </label>
                )}
              />
              {errors.__agreement && (
                <p className="mt-1.5 text-xs text-red-500">
                  Please accept the Privacy Policy and Terms of Service to continue.
                </p>
              )}
            </div>
          )}

          {error && (
            <div className="col-span-2 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="col-span-2 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-brand hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-200/60 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  {form.submitButtonLabel || 'Send Message'}
                  <Send className="h-4 w-4" />
                </>
              )}
            </button>
            {safetyNote && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                {safetyNote}
              </div>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
