import { useState } from "react";
import { useNavigate } from "react-router";
import ProfileSection from "@/features/setting/components/ProfileSection";
import SecuritySection from "@/features/setting/components/SecuritySection";

import SaveIcon from "@/assets/icons/save.svg?react";
import LogOutIcon from "@/assets/icons/log-out.svg?react";

const INITIAL_PROFILE = {
  name: "김민수",
  role: "점주",
  storeCode: "KOR-강남점",
  email: "minsu.kim@xross.io",
  phone: "010-1234-5678",
};

export default function AccountTab() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(INITIAL_PROFILE);

  const handleSave = () => {
    // TODO: API 연동
    console.log("저장:", profile);
  };

  const handleLogout = () => {
    navigate("/auth/login");
  };

  return (
    <div className="flex flex-col gap-8">
      <ProfileSection
        name={profile.name}
        role={profile.role}
        storeCode={profile.storeCode}
        email={profile.email}
        phone={profile.phone}
        onNameChange={(value) =>
          setProfile((prev) => ({ ...prev, name: value }))
        }
        onEmailChange={(value) =>
          setProfile((prev) => ({ ...prev, email: value }))
        }
        onPhoneChange={(value) =>
          setProfile((prev) => ({ ...prev, phone: value }))
        }
      />

      <SecuritySection lastPasswordChangeDays={30} isOtpEnabled={true} />

      {/* 액션 버튼 */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={handleSave}
          className="bg-brand-primary shadow-button flex h-10 w-full items-center justify-center gap-2 rounded-[10px] px-6 transition-opacity hover:opacity-90 sm:w-auto sm:justify-start"
        >
          <span className="relative size-4 shrink-0 text-white">
            <SaveIcon className="absolute block size-full max-w-none" />
          </span>
          <span className="text-[14px] leading-5 font-medium tracking-[-0.15px] text-white">
            변경 저장
          </span>
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-[10px] border border-[#e2e8f0] bg-white px-5 py-[1px] transition-opacity hover:opacity-80 sm:w-auto sm:justify-start"
        >
          <span className="relative size-4 shrink-0 text-[#fb2c36]">
            <LogOutIcon className="absolute block size-full max-w-none" />
          </span>
          <span className="text-[14px] leading-5 font-medium tracking-[-0.15px] text-[#fb2c36]">
            로그아웃
          </span>
        </button>
      </div>
    </div>
  );
}
