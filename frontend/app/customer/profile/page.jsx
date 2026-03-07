import { UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
  return (
    <div className="flex justify-center py-10">
      <UserProfile />
    </div>
  );
}
