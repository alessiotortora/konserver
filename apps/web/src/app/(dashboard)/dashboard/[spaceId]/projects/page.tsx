import { HeaderButtonContainer } from '@/components/layout/header-button-container';
import { Heading } from '@/components/layout/heading';
import { PageContainer } from '@/components/layout/page-container';
import { ProjectGrid } from '@/components/projects/project-grid';
import { Button } from '@/components/ui/button';
import { getProjects } from '@/lib/actions/get/get-projects';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';

type Params = Promise<{ spaceId: string }>;

interface ProjectsPageProps {
  params: Params;
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { spaceId } = await params;
  const { success, projects = [], error } = await getProjects(spaceId);

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Heading title="Projects" description="Manage and organize your projects" />
          <HeaderButtonContainer label="Create Project">
            <Button asChild>
              <Link href={`/dashboard/${spaceId}/projects/new`}>
                <PlusIcon className="w-4 h-4 mr-2" />
                Create Project
              </Link>
            </Button>
          </HeaderButtonContainer>
        </div>

        <ProjectGrid projects={projects} spaceId={spaceId} error={success ? undefined : error} />
      </div>
    </PageContainer>
  );
}
