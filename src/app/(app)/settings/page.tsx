import { SettingsView } from "@/components/settings/SettingsView";
import { PageHeader } from "@/components/layout/PageHeader";

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="설정" description="프로필과 계정을 관리하세요." />
      <SettingsView />
    </>
  );
}
