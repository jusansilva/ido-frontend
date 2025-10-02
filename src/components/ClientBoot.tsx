"use client";

import { useEffect } from "react";

type MaskKind = "cpf" | "cnpj" | "phone";

function onlyDigits(v: string) {
  return v.replace(/\D+/g, "");
}

function formatCPF(v: string) {
  const s = onlyDigits(v).slice(0, 11);
  const p1 = s.slice(0, 3);
  const p2 = s.slice(3, 6);
  const p3 = s.slice(6, 9);
  const p4 = s.slice(9, 11);
  let out = p1;
  if (p2) out += "." + p2;
  if (p3) out += "." + p3;
  if (p4) out += "-" + p4;
  return out;
}

function formatCNPJ(v: string) {
  const s = onlyDigits(v).slice(0, 14);
  const p1 = s.slice(0, 2);
  const p2 = s.slice(2, 5);
  const p3 = s.slice(5, 8);
  const p4 = s.slice(8, 12);
  const p5 = s.slice(12, 14);
  let out = p1;
  if (p2) out += "." + p2;
  if (p3) out += "." + p3;
  if (p4) out += "/" + p4;
  if (p5) out += "-" + p5;
  return out;
}

function formatPhone(v: string) {
  const s = onlyDigits(v).slice(0, 11);
  const ddd = s.slice(0, 2);
  const nine = s.length > 10; // 11 dígitos -> 5+4
  const p1 = s.slice(2, nine ? 7 : 6);
  const p2 = s.slice(nine ? 7 : 6, nine ? 11 : 10);
  let out = ddd ? `(${ddd}` : "";
  if (ddd && (p1 || p2)) out += ") ";
  out += p1;
  if (p2) out += "-" + p2;
  return out;
}

function detectMaskKind(el: HTMLInputElement): MaskKind | null {
  const sources = [el.name, el.id, el.placeholder, el.getAttribute("aria-label") || ""].join(" ").toLowerCase();
  // allow explicit override via data-mask attr
  const data = (el.getAttribute("data-mask") || "").toLowerCase();
  if (data === "cpf" || data === "cnpj" || data === "phone") return data as MaskKind;
  if (/\bcpf\b/.test(sources)) return "cpf";
  if (/\bcnpj\b/.test(sources)) return "cnpj";
  if (/(telefone|celular|whats|whatsapp|phone|tel)/.test(sources)) return "phone";
  return null;
}

function maskValue(kind: MaskKind, value: string) {
  if (kind === "cpf") return formatCPF(value);
  if (kind === "cnpj") return formatCNPJ(value);
  return formatPhone(value);
}

function example(kind: MaskKind) {
  if (kind === "cpf") return "000.000.000-00";
  if (kind === "cnpj") return "00.000.000/0000-00";
  return "(11) 98888-7777";
}

export default function ClientBoot() {
  useEffect(() => {
    // Theme init from localStorage or system preference
    try {
      const ls = typeof window !== "undefined" ? window.localStorage : null;
      const pref = ls?.getItem("theme");
      const root = document.documentElement;
      const apply = (mode: "light" | "dark" | "system") => {
        root.classList.remove("light", "dark");
        if (mode === "dark") root.classList.add("dark");
        if (mode === "light") root.classList.add("light");
      };
      if (pref === "light" || pref === "dark") apply(pref);
      else apply("system");
      // react to system changes only when no explicit choice
      const mm = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
      const onChange = () => {
        const p = ls?.getItem("theme");
        if (!p) apply("system");
      };
      mm?.addEventListener?.("change", onChange);
      return () => mm?.removeEventListener?.("change", onChange);
    } catch {}
  }, []);

  useEffect(() => {
    // Global input masks for CPF/CNPJ/Phone by heuristic or data-mask attr
    const handler = (e: Event) => {
      const target = e.target as (HTMLInputElement | null);
      if (!target || target.tagName !== "INPUT") return;
      const el = target as HTMLInputElement;
      if (el.type === "number" || el.readOnly || el.disabled) return;
      const kind = detectMaskKind(el);
      if (!kind) return;
      const prev = el.value;
      const next = maskValue(kind, prev);
      if (!el.placeholder) el.placeholder = example(kind);
      if (kind === "phone" && el.type === "text") el.type = "tel";
      if (next !== prev) {
        const pos = el.selectionStart || next.length;
        el.value = next;
        try { el.setSelectionRange(pos, pos); } catch {}
        el.dispatchEvent(new Event("input", { bubbles: true }));
      }
    };
    document.addEventListener("input", handler, true);
    document.addEventListener("blur", handler, true);
    return () => {
      document.removeEventListener("input", handler, true);
      document.removeEventListener("blur", handler, true);
    };
  }, []);

  return null;
}

