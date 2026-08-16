import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle2, Mail } from 'lucide-react';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';

export default function Contact() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();
  const [sent, setSent] = useState(false);

  const onSubmit = async () => {
    // No backend persistence by design — this simulates a send.
    // Wire this up to an email service (e.g. Resend, Formspree) in production.
    await new Promise((r) => setTimeout(r, 700));
    setSent(true);
    reset();
  };

  return (
    <section className="container-page py-16 max-w-xl">
      <span className="eyebrow">Get in touch</span>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">Contact</h1>
      <p className="mt-4 text-ink/65 dark:text-paper/65">
        Questions, feedback, or found a bug? Send a message below.
      </p>

      <Card className="mt-8">
        {sent ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-10 h-10 text-ok mx-auto mb-3" />
            <p className="font-medium">Message sent</p>
            <p className="text-sm text-ink/60 dark:text-paper/60 mt-1">Thanks for reaching out — we'll get back to you soon.</p>
            <Button variant="secondary" className="mt-5" onClick={() => setSent(false)}>Send another</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
              <input
                id="name"
                {...register('name', { required: 'Please enter your name.' })}
                className="w-full rounded-xl border border-paper-line dark:border-ink-line bg-paper dark:bg-ink px-4 py-3 text-sm outline-none focus:border-scan"
              />
              {errors.name && <p className="mt-1 text-xs text-flag-strong dark:text-flag">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
              <input
                id="email"
                type="email"
                {...register('email', {
                  required: 'Please enter your email.',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address.' },
                })}
                className="w-full rounded-xl border border-paper-line dark:border-ink-line bg-paper dark:bg-ink px-4 py-3 text-sm outline-none focus:border-scan"
              />
              {errors.email && <p className="mt-1 text-xs text-flag-strong dark:text-flag">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
              <textarea
                id="message"
                rows={5}
                {...register('message', { required: 'Please enter a message.', minLength: { value: 10, message: 'Message is a bit short.' } })}
                className="w-full rounded-xl border border-paper-line dark:border-ink-line bg-paper dark:bg-ink px-4 py-3 text-sm outline-none focus:border-scan resize-y"
              />
              {errors.message && <p className="mt-1 text-xs text-flag-strong dark:text-flag">{errors.message.message}</p>}
            </div>

            <Button type="submit" loading={isSubmitting} icon={Mail} className="w-full sm:w-auto">
              Send message
            </Button>
          </form>
        )}
      </Card>
    </section>
  );
}
