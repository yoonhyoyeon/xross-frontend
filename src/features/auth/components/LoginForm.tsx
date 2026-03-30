import Input from "@/shared/ui/Input";
import { useNavigate } from "react-router";

export default function LoginForm() {
  const navigate = useNavigate();
  return (
    <div className="flex w-96 flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-heading text-2xl leading-8 font-medium tracking-tight">
          관제 로그인
        </h1>
        <p className="text-body text-sm leading-5 tracking-tight">
          등록된 매장 관리자 계정으로 로그인하세요.
        </p>
      </div>

      <form
        className="flex flex-col gap-5"
        onSubmit={(e) => e.preventDefault()}
      >
        <Input label="이메일" type="email" placeholder="admin@store.com" />
        <Input label="비밀번호" type="password" placeholder="••••••••" />

        {/* 로그인 유지 + 비밀번호 찾기 */}
        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              className="border-checkbox-border accent-brand-primary size-4 rounded"
            />
            <span className="text-label text-xs font-medium">로그인 유지</span>
          </label>
          <a
            href="/auth/forgot-password"
            className="text-link hover:text-link-hover text-xs font-medium"
          >
            비밀번호 찾기
          </a>
        </div>

        <button
          type="submit"
          className="bg-brand-primary text-brand-on-primary shadow-button hover:bg-brand-primary-hover active:bg-brand-primary-active h-11 rounded-[10px] text-sm font-medium transition-colors"
          onClick={() => {
            navigate("/monitoring");
          }}
        >
          로그인
        </button>
      </form>
    </div>
  );
}
