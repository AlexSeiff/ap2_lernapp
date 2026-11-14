import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ExamRun, Fehlergrund, Sicherheit } from '../../shared/progress';
import type { Task } from '../../shared/types';
import { examMinutes, examRemaining } from '../lib/examTimer';
import { klausurFuer } from '../lib/mischKlausur';
import { finishExam, submitExam } from '../lib/progress';
import { useStore } from '../lib/store';

function useNow(active: boolean) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [active]);
  return now;
}

/**
 * Ablauf einer Übungsklausur: starten, beantworten, abgeben (auch automatisch bei Zeitablauf),
 * bewerten und abschließen. Rückfragen (useConfirm) und Navigation bleiben in der Seite.
 * `topicId` ist die ID eines Deep Dives oder einer gemischten Probeklausur („mix-…“, ROADMAP 8.5) – sie steht in ExamRun.topicId.
 */
export function useExamRun(topicId: string | undefined) {
  const { content, progress, update } = useStore();
  const quelle = useMemo(() => klausurFuer(content, topicId), [content, topicId]);
  const topic = quelle?.topic;
  const exam = quelle?.exam;
  const tasks: Task[] = exam ? exam.blocks.flatMap((b) => b.taskIds.map((id) => content.tasks[id])).filter(Boolean) : [];
  const run = progress.activeExam?.topicId === topicId ? progress.activeExam : undefined;
  const otherRun = progress.activeExam && !run ? progress.activeExam : undefined;
  const [result, setResult] = useState<ExamRun | null>(null);
  const now = useNow(!!run && !run.submittedAt);

  // Bearbeitungszeit dieser Klausur (WiSo 60, sonst 90 Minuten) – aus dem Titel, nicht aus dem gespeicherten Lauf.
  const minutes = examMinutes(exam);
  const remaining = run ? examRemaining(run.startedAt, minutes, now) : 0;

  // Zeit abgelaufen → automatisch abgeben (wie in der echten Prüfung). submitExam arbeitet auf dem aktuellen Stand, nicht auf `run`.
  useEffect(() => {
    if (run && !run.submittedAt && remaining === 0) update((p) => submitExam(p));
  }, [run, remaining, update]);

  const start = () => {
    if (!quelle || !exam) return;
    update((p) => ({
      ...p,
      activeExam: {
        id: `ex-${Date.now().toString(36)}`,
        topicId: quelle.id,
        startedAt: new Date().toISOString(),
        answers: {},
        scores: {},
        max: exam.totalPoints,
      },
    }));
  };

  const setAnswer = useCallback(
    (taskId: string, value: string) =>
      update((p) => (p.activeExam ? { ...p, activeExam: { ...p.activeExam, answers: { ...p.activeExam.answers, [taskId]: value } } } : p)),
    [update],
  );
  const setScore = useCallback(
    (taskId: string, value: number) =>
      update((p) => (p.activeExam ? { ...p, activeExam: { ...p.activeExam, scores: { ...p.activeExam.scores, [taskId]: value } } } : p)),
    [update],
  );

  /** Selbsteinschätzung je Aufgabe (ROADMAP 8.3); undefined entfernt sie. Nur vor der Abgabe. */
  const setSicherheit = useCallback(
    (taskId: string, value: Sicherheit | undefined) =>
      update((p) => {
        if (!p.activeExam || p.activeExam.submittedAt) return p;
        const { [taskId]: _alt, ...rest } = p.activeExam.sicherheit ?? {};
        return { ...p, activeExam: { ...p.activeExam, sicherheit: value ? { ...rest, [taskId]: value } : rest } };
      }),
    [update],
  );

  /** Fehlergrund je Aufgabe (ROADMAP 8.7); undefined entfernt ihn. Nur nach der Abgabe, beim Bewerten. */
  const setFehlergrund = useCallback(
    (taskId: string, value: Fehlergrund | undefined) =>
      update((p) => {
        if (!p.activeExam?.submittedAt) return p;
        const { [taskId]: _alt, ...rest } = p.activeExam.fehlergrund ?? {};
        return { ...p, activeExam: { ...p.activeExam, fehlergrund: value ? { ...rest, [taskId]: value } : rest } };
      }),
    [update],
  );

  const submit = () => update((p) => submitExam(p));

  /** Unbewertete Aufgaben zählen 0 Punkte; Ergebnis landet in der Historie und im Fehlerjournal. */
  const finish = () => {
    if (!run) return;
    const final: ExamRun = { ...run, scores: Object.fromEntries(tasks.map((t) => [t.id, run.scores[t.id] ?? 0])) };
    update((p) => finishExam(p, final, tasks));
    setResult({ ...final, total: Object.values(final.scores).reduce((a, b) => a + b, 0) });
  };

  const abort = () => update((p) => ({ ...p, activeExam: undefined }));

  const answered = run ? tasks.filter((t) => run.answers[t.id]?.trim()).length : 0;
  const scored = run ? tasks.filter((t) => run.scores[t.id] !== undefined).length : 0;
  const sum = run ? tasks.reduce((s, t) => s + (run.scores[t.id] ?? 0), 0) : 0;

  return {
    quelle,
    topic,
    exam,
    tasks,
    run,
    otherRun,
    result,
    submitted: !!run?.submittedAt,
    minutes,
    remaining,
    answered,
    scored,
    sum,
    start,
    setAnswer,
    setScore,
    setSicherheit,
    setFehlergrund,
    submit,
    finish,
    abort,
  };
}
