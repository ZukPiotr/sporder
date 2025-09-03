// src/components/auth/AuthModal.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Modal from "../ui/Modal";
import Field from "../ui/Field";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function AuthModal({ open, mode = "login", onClose, onSuccess }) {
  const { register, login, loading } = useAuth();
  const [authMode, setAuthMode] = useState(mode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  // 1. DODAJEMY NOWY STAN DLA WIADOMOŚCI O SUKCESIE
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setAuthMode(mode);
    setError("");
    setSuccessMessage(""); // Czyścimy komunikat o sukcesie przy otwarciu
    setEmail("");
    setPassword("");
    setName("");
  }, [mode, open]);

  // 2. AKTUALIZUJEMY LOGIKĘ OBSŁUGI FORMULARZA
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      if (authMode === "register") {
        const response = await register({ email, password, name });
        setSuccessMessage(response.message); // Ustawiamy wiadomość z odpowiedzi API
      } else {
        await login({ email, password });
        setSuccessMessage("Zalogowano pomyślnie!"); // Ustawiamy generyczną wiadomość
      }

      // Po sukcesie (rejestracji lub logowania), czekamy 2 sekundy i zamykamy modal
      setTimeout(() => {
        onSuccess?.(authMode);
        onClose();
      }, 2000); // 2000ms = 2 sekundy

    } catch (err) {
      setError(err.message || "Wystąpił błąd");
    }
  }

  return (
    <Modal
      open={open}
      title={authMode === "login" ? "Zaloguj się" : "Utwórz konto"}
      onClose={onClose}
    >
      <form className="grid gap-3" onSubmit={handleSubmit}>
        {authMode === "register" && (
          <Field label="Imię / nick">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="np. Ola" />
          </Field>
        )}
        <Field label="E‑mail">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="np. ola@example.com" required />
        </Field>
        <Field label="Hasło">
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="min. 6 znaków" required />
        </Field>

        {/* 3. DODAJEMY WYŚWIETLANIE WIADOMOŚCI O SUKCESIE */}
        {successMessage && (
          <div className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">
            {successMessage}
          </div>
        )}
        
        {error && (
          <div className="rounded-xl border border-rose-400/40 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            type="button"
            className="text-sm text-[var(--muted)] underline decoration-dotted"
            onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
            disabled={loading}
          >
            {authMode === "login" ? "Nie masz konta? Zarejestruj się" : "Masz już konto? Zaloguj się"}
          </button>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>Anuluj</Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Przetwarzanie..." : (authMode === "login" ? "Zaloguj" : "Zarejestruj")}
            </Button>
          </div>
        </div>
        <p className="text-xs text-[var(--muted)]">
          Demo: dane są zapisywane w ściśle tajnej bazie danych. Śmiało używaj prawdziwych haseł.
        </p>
      </form>
    </Modal>
  );
}