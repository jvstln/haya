import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const teamMembers = [
  { image: "", name: "John Doe", className: "bg-[oklch(20%_50%_0deg)]" },
  { image: "", name: "Jane Doe", className: "bg-[oklch(20%_50%_240deg)]" },
];

const ProfilePage = () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="font-bold text-lg">Manage your profile</h1>

      <div className="flex gap-4 *:grow max-md:flex-col">
        <div className="bg-(image:--colorful-gradient) space-y-2 rounded-md p-4 text-background">
          <h3 className="font-bold">Track and analyze users behaviour</h3>
          <p>
            Increase users onboarding and engagement, analyzing for best
            gamification approach for retention.
          </p>
          <div className="relative mt-6">
            <div className="-translate-y-2 pointer-events-none absolute inset-0 scale-95 rounded-md bg-background/60" />
            <Input
              className="bg-background placeholder:text-white disabled:opacity-100"
              placeholder="enter your product link"
              disabled
            />
          </div>
        </div>
        <div
          className="relative space-y-2 overflow-hidden rounded-md border-2 border-transparent p-4"
          style={{
            background: `
            linear-gradient(var(--color-background), var(--color-background)) padding-box,
            var(--colorful-gradient) border-box`,
          }}
        >
          {/* Ellipsis background */}
          <div
            className="absolute top-full left-4/5 size-44 blur-2xl"
            style={{
              background:
                "linear-gradient(261.15deg, rgba(255, 175, 164, 0.8) -29.14%, rgba(122, 99, 255, 0.8) 99.41%)",
            }}
          />
          <h3 className="font-bold">Team members</h3>
          <p>Create team members to increase workflow</p>
          <div className="-space-x-1 flex items-center">
            {teamMembers.map((tm) => (
              <Avatar key={tm.name}>
                <AvatarImage src={tm.image} />
                <AvatarFallback
                  className={cn("border border-foreground", tm.className)}
                >
                  {tm.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <Button color="colorful">Add team members</Button>
        </div>
      </div>

      <h2 className="font-bold text-lg">Manage your profile</h2>
      <Skeleton className="h-119 w-full" />
    </div>
  );
};

export default ProfilePage;
