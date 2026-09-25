import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ComingSoon({ phase, title }: { phase: string; title: string }) {
  return (
    <Card className="mx-auto max-w-lg text-center">
      <CardHeader>
        <CardDescription>{phase}</CardDescription>
        <CardTitle>{title} coming next</CardTitle>
        <CardDescription>
          This screen is planned for a later phase. Profile is ready to use right now.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
