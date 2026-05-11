"use client";

import { motion } from "framer-motion";
import type { AssessmentResult as Result } from "@/types/assessment";
import { AlertBox } from "@/components/pre-checkin/FormCard";

interface Props {
  result: Result;
  petName: string;
  assessmentId?: string;
}

const STATUS_CONFIG = {
  APPROVED: {
    bg: "from-emerald-500 to-[#40d9c8]",
    icon: "✅",
    title: "Pré-Check-In Aprovado!",
    subtitle: "Seu pet está pronto para uma estadia incrível.",
  },
  APPROVED_WITH_WARNINGS: {
    bg: "from-amber-400 to-amber-500",
    icon: "⚠️",
    title: "Aprovado com Observações",
    subtitle: "Algumas informações requerem atenção especial da equipe.",
  },
  BLOCKED: {
    bg: "from-red-500 to-red-600",
    icon: "🚫",
    title: "Reserva Bloqueada",
    subtitle: "Há pendências sanitárias que impedem a hospedagem no momento.",
  },
};

const RISK_LABELS: Record<string, string> = {
  low: "Baixo",
  medium: "Moderado",
  high: "Alto",
  critical: "Crítico",
};

const RISK_COLORS: Record<string, string> = {
  low: "text-emerald-600 bg-emerald-50",
  medium: "text-amber-600 bg-amber-50",
  high: "text-orange-600 bg-orange-50",
  critical: "text-red-600 bg-red-50",
};

export function AssessmentResult({ result, petName, assessmentId }: Props) {
  const config = STATUS_CONFIG[result.status];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Status hero */}
      <div
        className={`rounded-3xl bg-gradient-to-br ${config.bg} text-white p-8 text-center shadow-xl`}
      >
        <div className="text-5xl mb-3">{config.icon}</div>
        <h2 className="text-2xl font-bold mb-1">{config.title}</h2>
        <p className="text-white/85 text-sm mb-4">{config.subtitle}</p>
        <div className="text-sm font-medium bg-white/20 rounded-xl px-4 py-2 w-fit mx-auto">
          {petName} — ID: {assessmentId?.slice(0, 8).toUpperCase()}
        </div>
      </div>

      {/* Sanitary score */}
      <div className="rounded-2xl bg-white border border-[#ffd4d4] p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-[#2c1810]">Score Sanitário</h3>
            <p className="text-xs text-[#8a6050] mt-0.5">Avaliação de risco geral</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-[#f07070]">
              {result.sanitaryScore}
            </span>
            <span className="text-[#8a6050] text-sm">/100</span>
          </div>
        </div>
        <div className="relative h-3 bg-[#ffeaea] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${result.sanitaryScore}%` }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#f07070] to-[#40d9c8]"
          />
        </div>
        <div className="flex justify-end mt-2">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${RISK_COLORS[result.riskLevel]}`}
          >
            Risco {RISK_LABELS[result.riskLevel]}
          </span>
        </div>
      </div>

      {/* Vaccine warnings */}
      {result.vaccineWarnings.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-[#2c1810] px-1">Alertas de Vacinação</h3>
          {result.vaccineWarnings.map((w, i) => (
            <AlertBox
              key={i}
              type={w.blocksApproval ? "error" : "warning"}
            >
              {w.message}
            </AlertBox>
          ))}
        </div>
      )}

      {/* Auto-added services */}
      {result.autoServices.length > 0 && (
        <div className="rounded-2xl bg-white border border-[#ffd4d4] p-5 shadow-sm">
          <h3 className="font-semibold text-[#2c1810] mb-3">
            🛡️ Serviços Obrigatórios Adicionados
          </h3>
          <div className="space-y-2">
            {result.autoServices.map((s, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-sm py-2 border-b border-[#ffeaea] last:border-0"
              >
                <span className="text-red-500 mt-0.5">⚠</span>
                <div className="flex-1">
                  <p className="font-medium text-[#2c1810]">{s.reason}</p>
                </div>
                <span className="font-semibold text-[#f07070] flex-shrink-0">
                  R$ {s.price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Operational notes */}
      {result.operationalNotes.length > 0 && (
        <div className="rounded-2xl bg-[#fff5f4] border border-[#ffd4d4] p-5">
          <h3 className="font-semibold text-[#2c1810] mb-3">
            📋 Notas Operacionais para a Equipe
          </h3>
          <ul className="space-y-1.5">
            {result.operationalNotes.map((note, i) => (
              <li key={i} className="text-sm text-[#5c3d30] leading-relaxed">
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.status === "BLOCKED" && (
        <AlertBox type="error" title="Próximos Passos">
          Entre em contato com a equipe da PitPet Store pelo WhatsApp para
          verificar as pendências e reagendar após a regularização.
        </AlertBox>
      )}

      {result.status !== "BLOCKED" && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-5 py-4 text-sm text-emerald-800">
          <p className="font-semibold mb-1">🎉 Pré-check-in enviado com sucesso!</p>
          <p>
            Nossa equipe já recebeu o formulário e entrará em contato para
            confirmar os detalhes da reserva. Mal podemos esperar para receber{" "}
            {petName}!
          </p>
        </div>
      )}
    </motion.div>
  );
}
