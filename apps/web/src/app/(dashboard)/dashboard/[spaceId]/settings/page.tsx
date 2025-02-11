import { ProfileForm } from '@/components/forms/profile-form';
import { Heading } from '@/components/layout/heading';
import { ScrollContainer } from '@/components/layout/scroll-container';
import { ApiKeyManager } from '@/components/settings/api-key-manager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { db } from '@/db';
// import { spaces } from '@/db/schema';
import { getSafeUser } from '@/lib/actions/get/get-safe-user';
import type { SafeUser } from '@/types/user';
// import { eq } from 'drizzle-orm';

// TODO
// type Params = Promise<{ spaceId: string }>;

// interface SettingsPageProps {
//   params: Params;
// }

export default async function SettingsPage() {
  //   const { spaceId } = await params;
  // }
  const user = (await getSafeUser()) as SafeUser;
  // TODO
  // const [space] = await db.select().from(spaces).where(eq(spaces.id, spaceId));

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4">
        <Heading title="Settings" description="Manage your account and API keys" />
      </div>

      {/* Scrollable Content */}
      <ScrollContainer>
        <div className="p-4">
          <Tabs defaultValue="user" className="space-y-6">
            <TabsList>
              <TabsTrigger value="user">User Settings</TabsTrigger>
              <TabsTrigger value="space">Space Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="user" className="space-y-8">
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Profile</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage your personal information
                  </p>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-muted-foreground">{user.email}</p>
                    </div>
                    <ProfileForm user={user} />
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2">API Key</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your API key for accessing the API. Keep this secret!
                  </p>
                  <ApiKeyManager />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="space" className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold mb-2">Space Details</h2>
                <p className="text-sm text-muted-foreground mb-4">Manage your space settings</p>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">Space Name</p>
                    <p className="text-muted-foreground">DEFAULT</p>
                  </div>
                  <div>
                    <p className="font-medium">Description</p>
                    <p className="text-muted-foreground">DEFAULT</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">Members</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage who has access to this space
                </p>
                <p className="text-muted-foreground">Coming soon...</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollContainer>
    </div>
  );
}
