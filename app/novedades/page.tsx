"use client";

import { ComingSoon } from "@/components/coming-soon";
import { COMING_SOON_FEATURES } from "@/lib/constants";

export default function NovedadesPage() {
  const feature = COMING_SOON_FEATURES.novedades;
  return (
    <ComingSoon
      title={feature.title}
      description={feature.description}
      icon={feature.icon}
      previewItems={feature.previewItems}
    />
  );
}
