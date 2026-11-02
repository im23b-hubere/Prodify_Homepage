import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="shell py-28 sm:py-40">
      <h1 className="type-hero max-w-3xl">Nothing at this address.</h1>
      <p className="type-lead mt-6 max-w-md">The page may have moved. The plugins are still where you left them.</p>
      <div className="mt-8 flex flex-wrap gap-2">
        <ButtonLink href="/plugins">Explore Plugins</ButtonLink>
        <ButtonLink href="/" variant="secondary">
          Go to the homepage
        </ButtonLink>
      </div>
    </div>
  );
}
