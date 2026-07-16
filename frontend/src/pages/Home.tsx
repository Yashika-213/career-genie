import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Map,
  MessageSquare,
  LayoutDashboard,
  BookOpen,
  Mic,
  ArrowRight,
  BrainCircuit,
} from 'lucide-react';
import { Button } from '../components/ui';

const features = [
  { icon: BrainCircuit, title: 'Real ML Recommendation', desc: 'A trained Decision Tree predicts your ideal career from your skills, interests and goals — with a confidence score.' },
  { icon: Map, title: 'Personalized Roadmaps', desc: 'Step-by-step learning paths with estimated hours, resources and progress tracking.' },
  { icon: MessageSquare, title: 'AI Career Chatbot', desc: 'Ask what to learn next, which skills you’re missing, or for project ideas — answered from your own data.' },
  { icon: Mic, title: 'Voice Assistant', desc: 'Talk to CareerGenie hands-free with speech-to-text and spoken replies.' },
  { icon: LayoutDashboard, title: 'Progress Dashboard', desc: 'Visualize completion, remaining skills and time-to-finish with clean charts.' },
  { icon: BookOpen, title: 'Curated Resources', desc: 'Docs, videos and practice sites for every skill — save your favorites.' },
];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:px-12">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-accent-500/10" />
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700 dark:border-brand-900 dark:bg-brand-950 dark:text-brand-300">
            <Sparkles className="h-4 w-4" /> AI-Powered Career Guidance
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
            Find your path with{' '}
            <span className="bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">
              CareerGenie
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Get a personalized tech-career recommendation from a real machine-learning model, generate
            a learning roadmap, track your progress, and chat with an AI assistant — by voice or text.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/recommend">
              <Button size="lg" leftIcon={<Sparkles className="h-5 w-5" />}>
                Get my career match
              </Button>
            </Link>
            <Link to="/chatbot">
              <Button size="lg" variant="outline" leftIcon={<MessageSquare className="h-5 w-5" />}>
                Chat with the assistant
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section>
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Everything you need to plan your career
          </h2>
          <p className="mt-2 text-slate-500">From recommendation to mastery — all in one place.</p>
        </div>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-lg shadow-brand-600/20">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-800 dark:text-white">{f.title}</h3>
              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="rounded-3xl bg-gradient-to-r from-brand-600 to-accent-500 px-8 py-12 text-center text-white shadow-lg">
        <h2 className="text-3xl font-bold">Ready to discover your ideal career?</h2>
        <p className="mx-auto mt-2 max-w-xl text-white/90">
          Answer a few questions and let the model do the rest. It takes less than a minute.
        </p>
        <Link to="/recommend" className="mt-6 inline-block">
          <Button
            size="lg"
            variant="secondary"
            className="!bg-white !text-brand-700 hover:!bg-slate-100"
          >
            Start now <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>

      <footer className="border-t border-slate-200 pb-4 pt-8 text-center text-sm text-slate-400 dark:border-slate-800">
        CareerGenie · MCA Final Year Major Project · Built with React, Express, SQLite &amp; scikit-learn
      </footer>
    </div>
  );
}
