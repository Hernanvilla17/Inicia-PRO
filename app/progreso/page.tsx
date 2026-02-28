"use client";

import { ComingSoon } from "@/components/coming-soon";
import { COMING_SOON_FEATURES } from "@/lib/constants";

export default function ProgresoPage() {
  const feature = COMING_SOON_FEATURES.progreso;
  return (
    <ComingSoon
      title={feature.title}
      description={feature.description}
      icon={feature.icon}
      previewItems={feature.previewItems}
    />
  );
}
