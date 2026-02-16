"use client";

import { useState } from "react";
import { useTranslations } from "@/lib/i18n";

type Step = 1 | 2 | 3;

export default function GiftConfigurator() {
  const [step, setStep] = useState<Step>(1);
  const [weight, setWeight] = useState<"300g" | "500g" | "1kg">("500g");
  const [box, setBox] = useState<"craft" | "tin" | "wood">("craft");
  const [items, setItems] = useState<string[]>(["cranberry", "cherry"]);
  const t = useTranslations();

  function toggleItem(id: string) {
    setItems((arr) => (arr.includes(id) ? arr.filter((i) => i !== id) : [...arr, id]));
  }

  async function submit() {
    const payload = { weight, box, items };
    await fetch("/api/gift-request", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type: "configurator", ...payload }),
    });
    alert(t('gift_configurator.success'));
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-500 font-medium">
        {t('gift_configurator.step')} {step} {t('gift_configurator.of')} 3
      </div>

      {step === 1 && (
        <div className="space-y-5">
          <h3 className="text-xl font-semibold text-gray-900">{t('gift_configurator.step1_title')}</h3>
          <div className="flex flex-wrap gap-3">
            {(["300g", "500g", "1kg"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setWeight(v)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                  weight === v 
                    ? "bg-berry text-white border-berry" 
                    : "bg-white text-gray-600 border-gray-200 hover:border-berry hover:text-berry"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <h3 className="text-xl font-semibold text-gray-900">{t('gift_configurator.step2_title')}</h3>
          <div className="flex flex-wrap gap-3">
            {(["craft", "tin", "wood"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setBox(v)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors capitalize ${
                  box === v 
                    ? "bg-berry text-white border-berry" 
                    : "bg-white text-gray-600 border-gray-200 hover:border-berry hover:text-berry"
                }`}
              >
                {t(`gift_configurator.box.${v}`)}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <h3 className="text-xl font-semibold text-gray-900">{t('gift_configurator.step3_title')}</h3>
          <div className="flex flex-wrap gap-3">
            {["cranberry", "cherry", "pumpkin", "mix", "golden-berries"].map((id) => {
              const active = items.includes(id);
              return (
                <button 
                  key={id} 
                  onClick={() => toggleItem(id)} 
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                    active 
                      ? "bg-berry text-white border-berry" 
                      : "bg-white text-gray-600 border-gray-200 hover:border-berry hover:text-berry"
                  }`}
                >
                  {t(`gift_configurator.items.${id}`)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-between">
        <button
          onClick={() =>
            setStep((s) => {
              const n = (s - 1) as number;
              return (n < 1 ? 1 : (n as Step)) as Step;
            })
          }
          className="btn btn-secondary"
          disabled={step === 1}
        >
          {t('gift_configurator.back')}
        </button>
        {step < 3 ? (
          <button
            onClick={() =>
              setStep((s) => {
                const n = (s + 1) as number;
                return (n > 3 ? 3 : (n as Step)) as Step;
              })
            }
            className="btn btn-primary"
          >
            {t('gift_configurator.next')}
          </button>
        ) : (
          <button onClick={submit} className="btn btn-primary">
            {t('gift_configurator.submit')}
          </button>
        )}
      </div>
    </div>
  );
}
