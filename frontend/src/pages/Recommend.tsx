import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, RotateCcw, Trophy } from 'lucide-react';
import { Button, Card, Label, Select, PageHeader } from '../components/ui';
import { ChipMultiSelect } from '../components/ui/ChipMultiSelect';
import { ProgressBar } from '../components/ui';
import {
  SKILL_OPTIONS,
  INTEREST_OPTIONS,
  EDUCATION_OPTIONS,
  DOMAIN_OPTIONS,
} from '../lib/constants';
import { predictCareer, createRoadmap } from '../api/endpoints';
import { getErrorMessage } from '../api/client';
import { useToast } from '../context/ToastContext';
import { useActiveRoadmap } from '../hooks/useActiveRoadmap';
import type { PredictionResult } from '../types';

export default function Recommend() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setActiveId } = useActiveRoadmap();

  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [education, setEducation] = useState(EDUCATION_OPTIONS[2]);
  const [domain, setDomain] = useState(DOMAIN_OPTIONS[0]);

  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (skills.length === 0) {
      toast('Please select at least one skill.', 'error');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await predictCareer({ skills, interests, education, domain });
      setResult(res);
    } catch (err) {
      toast(getErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setSkills([]);
    setInterests([]);
  };

  const generateRoadmap = async () => {
    if (!result?.careerDetails) return;
    setCreating(true);
    try {
      const roadmap = await createRoadmap(result.careerDetails.slug);
      setActiveId(roadmap.id);
      toast('Roadmap generated!', 'success');
      navigate(`/roadmap/${roadmap.id}`);
    } catch (err) {
      toast(getErrorMessage(err), 'error');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Career Match"
        subtitle="Tell us about yourself — a trained ML model recommends your ideal tech career."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Form */}
        <Card className="p-6 lg:col-span-3">
          <form onSubmit={submit} className="space-y-6">
            <div>
              <Label>Current skills</Label>
              <ChipMultiSelect options={SKILL_OPTIONS} selected={skills} onChange={setSkills} />
            </div>
            <div>
              <Label>Interests</Label>
              <ChipMultiSelect options={INTEREST_OPTIONS} selected={interests} onChange={setInterests} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="edu">Education</Label>
                <Select id="edu" value={education} onChange={(e) => setEducation(e.target.value)}>
                  {EDUCATION_OPTIONS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="domain">Preferred domain</Label>
                <Select id="domain" value={domain} onChange={(e) => setDomain(e.target.value)}>
                  {DOMAIN_OPTIONS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="submit" loading={loading} leftIcon={<Sparkles className="h-4 w-4" />}>
                Predict my career
              </Button>
              {(result || skills.length > 0) && (
                <Button type="button" variant="ghost" onClick={reset} leftIcon={<RotateCcw className="h-4 w-4" />}>
                  Reset
                </Button>
              )}
            </div>
          </form>
        </Card>

        {/* Result */}
        <div className="lg:col-span-2">
          {result ? (
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-br from-brand-600 to-accent-500 p-6 text-white">
                  <div className="flex items-center gap-2 text-sm font-medium text-white/80">
                    <Trophy className="h-4 w-4" /> Recommended career
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-4xl">{result.careerDetails?.icon ?? '🎯'}</span>
                    <span className="text-2xl font-extrabold">{result.career}</span>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm">
                      <span>Confidence</span>
                      <span className="font-semibold">{Math.round(result.confidence * 100)}%</span>
                    </div>
                    <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-white/25">
                      <motion.div
                        className="h-full rounded-full bg-white"
                        initial={{ width: 0 }}
                        animate={{ width: `${result.confidence * 100}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-6">
                  {result.careerDetails && (
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {result.careerDetails.description}
                    </p>
                  )}

                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Other strong matches
                    </div>
                    <div className="space-y-2">
                      {result.alternatives
                        .filter((a) => a.title !== result.career)
                        .slice(0, 3)
                        .map((a) => (
                          <div key={a.title} className="flex items-center gap-3 text-sm">
                            <span className="w-36 shrink-0 truncate text-slate-600 dark:text-slate-300">
                              {a.icon} {a.title}
                            </span>
                            <ProgressBar value={a.probability * 100} className="flex-1" />
                            <span className="w-10 text-right text-slate-400">
                              {Math.round(a.probability * 100)}%
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <Button
                    onClick={generateRoadmap}
                    loading={creating}
                    disabled={!result.careerDetails}
                    className="w-full"
                  >
                    Generate my roadmap <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ) : (
            <Card className="flex h-full flex-col items-center justify-center p-10 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-500 dark:bg-slate-800">
                <Sparkles className="h-8 w-8" />
              </div>
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                Select your skills and interests, then hit <b>Predict my career</b> to see your ML-powered match.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
