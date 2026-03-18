interface AdminFormBannerProps {
  tone: "success" | "error";
  message: string;
}

export function AdminFormBanner({ tone, message }: AdminFormBannerProps) {
  return <div className={`adminx-form-banner adminx-form-banner--${tone}`}>{message}</div>;
}
