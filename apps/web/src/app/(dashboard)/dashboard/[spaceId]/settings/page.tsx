import { ProfileForm } from '@/components/forms/profile-form';
import { ApiKeyManager } from '@/components/settings/api-key-manager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { db } from '@/db';
import { spaces } from '@/db/schema';
import { getSafeUser } from '@/lib/actions/get/get-safe-user';
import { createClient } from '@/utils/supabase/server';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

interface SettingsPageProps {
  params: {
    spaceId: string;
  };
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect('/login');
  }

  const user = await getSafeUser();

  if (!user) {
    redirect('/login');
  }

  const [space] = await db.select().from(spaces).where(eq(spaces.id, params.spaceId));

  if (!space) {
    redirect('/dashboard');
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and space settings</p>
      </div>

      <Tabs defaultValue="user" className="space-y-6">
        <TabsList>
          <TabsTrigger value="user">User Settings</TabsTrigger>
          <TabsTrigger value="space">Space Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="user" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Manage your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
                <ProfileForm user={user} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Key</CardTitle>
              <CardDescription>
                Your API key for accessing the API. Keep this secret!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ApiKeyManager user={user} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="space" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Space Details</CardTitle>
              <CardDescription>Manage your space settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Space Name</p>
                  <p className="text-muted-foreground">{space.name}</p>
                </div>
                <div>
                  <p className="font-medium">Description</p>
                  <p className="text-muted-foreground">{space.description || 'No description'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Members</CardTitle>
              <CardDescription>Manage who has access to this space</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
