"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck, Leaf, TreePine } from "lucide-react";

interface StickyActionBarProps {
  // Eco impact (optional)
  ecoImpact?: {
    trees: number;
    co2: number;
  };
  // Back button
  backHref?: string;
  backLabel?: string;
  onBack?: () => void;
  // Forward button
  forwardHref?: string;
  forwardLabel: string;
  forwardIcon?: "arrow" | "lock" | "none";
  forwardDisabled?: boolean;
  forwardLoading?: boolean;
  onForward?: () => void;
  // Extra info
  securityText?: string;
  total?: number;
}

export default function StickyActionBar({
  ecoImpact,
  backHref,
  backLabel = "Back",
  onBack,
  forwardHref,
  forwardLabel,
  forwardIcon = "arrow",
  forwardDisabled = false,
  forwardLoading = false,
  onForward,
  securityText,
  total,
}: StickyActionBarProps) {
  const ForwardIcon = forwardIcon === "arrow" ? ArrowRight : forwardIcon === "lock" ? ShieldCheck : null;

  const renderBackButton = () => {
    const buttonContent = (
      <>
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">{backLabel}</span>
      </>
    );

    const buttonClasses = `
      flex items-center gap-2 px-4 py-3 sm:px-6 sm:py-3.5
      text-[#4B5563] font-semibold text-sm
      bg-white border border-[#E5E7EB] rounded-xl
      hover:border-[#0A9B6B] hover:text-[#0A9B6B]
      transition-all duration-200
      min-h-[44px]
    `;

    if (backHref) {
      return (
        <Link href={backHref} className={buttonClasses}>
          {buttonContent}
        </Link>
      );
    }

    if (onBack) {
      return (
        <button onClick={onBack} className={buttonClasses}>
          {buttonContent}
        </button>
      );
    }

    return null;
  };

  const renderForwardButton = () => {
    const buttonContent = (
      <>
        {forwardLoading ? (
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            {forwardLabel}
            {total !== undefined && <span className="font-bold">₹{total}</span>}
            {ForwardIcon && <ForwardIcon className="w-4 h-4" />}
          </>
        )}
      </>
    );

    const buttonClasses = `
      flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-3.5
      text-white font-bold text-sm
      rounded-xl transition-all duration-200
      min-h-[44px] flex-1 sm:flex-none
      ${forwardDisabled || forwardLoading
        ? "bg-[#9CA3AF] cursor-not-allowed"
        : "bg-[#0A9B6B] hover:bg-[#076B4A] hover:-translate-y-0.5 shadow-lg shadow-[#0A9B6B]/20"
      }
    `;

    if (forwardHref && !forwardDisabled && !forwardLoading) {
      return (
        <Link href={forwardHref} className={buttonClasses}>
          {buttonContent}
        </Link>
      );
    }

    return (
      <button 
        onClick={onForward} 
        disabled={forwardDisabled || forwardLoading}
        className={buttonClasses}
      >
        {buttonContent}
      </button>
    );
  };

  return (
    <div className="sticky-bottom-bar">
      <div className="max-w-5xl mx-auto">
        {/* Mobile: Stack layout */}
        <div className="flex flex-col gap-3 sm:hidden">
          {/* Eco Impact */}
          {ecoImpact && (
            <div className="flex items-center justify-center gap-3 text-xs font-medium text-[#076B4A] bg-[#D1F5E5] rounded-lg py-2 px-3">
              <span className="flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5" />
                {ecoImpact.trees} trees
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <TreePine className="w-3.5 h-3.5" />
                {ecoImpact.co2}kg CO₂
              </span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center gap-3">
            {renderBackButton()}
            {renderForwardButton()}
          </div>
        </div>

        {/* Desktop: Row layout */}
        <div className="hidden sm:flex items-center justify-between gap-4">
          {/* Left: Eco Impact or Security */}
          <div className="flex items-center gap-4 text-sm">
            {ecoImpact ? (
              <div className="flex items-center gap-3 text-[#076B4A] bg-[#D1F5E5] rounded-xl py-2.5 px-4 font-medium">
                <span className="flex items-center gap-1.5">
                  <Leaf className="w-4 h-4" />
                  Your Eco Impact: {ecoImpact.trees} trees
                </span>
                <span>•</span>
                <span>{ecoImpact.co2}kg CO₂</span>
              </div>
            ) : securityText ? (
              <div className="flex items-center gap-2 text-[#4B5563]">
                <ShieldCheck className="w-4 h-4 text-[#0A9B6B]" />
                <span className="font-medium">{securityText}</span>
              </div>
            ) : null}
          </div>

          {/* Right: Buttons */}
          <div className="flex items-center gap-3">
            {renderBackButton()}
            {renderForwardButton()}
          </div>
        </div>
      </div>
    </div>
  );
}
