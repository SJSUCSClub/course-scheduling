import { Schedule } from '@/components/organisms';

export default function Loading() {
  return (
    <section className="mx-auto w-full max-w-content-width animate-pulse px-md text-neutral">
      <p className="pb-md">- Schedule(s)</p>
      <div className="grid gap-md pb-md max-lg:grid-cols-1 lg:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <Schedule
            key={i}
            link="#"
            subtitle="-"
            title="Loading..."
            dates="-"
            times="-"
            location="-"
            modeOfInstruction="-"
            days=""
          />
        ))}
      </div>
    </section>
  );
}
