import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl border bg-white text-gray-900 shadow ${className}`}
      {...props}
    />
  );
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardHeader({ className = "", ...props }: CardHeaderProps) {
  return (
    <div className={`p-6 pb-0 ${className}`} {...props} />
  );
}

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export function CardTitle({ className = "", ...props }: CardTitleProps) {
  return (
    <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props} />
  );
}

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function CardDescription({ className = "", ...props }: CardDescriptionProps) {
  return (
    <p className={`text-sm text-gray-500 ${className}`} {...props} />
  );
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardContent({ className = "", ...props }: CardContentProps) {
  return (
    <div className={`p-6 pt-0 ${className}`} {...props} />
  );
}