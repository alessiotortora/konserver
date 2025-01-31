import { ProjectForm } from '@/components/forms/project-form';
import { Heading } from '@/components/layout/heading';
import { getSpaceMedia } from '@/lib/actions/get/get-space-media';

type Params = Promise<{ spaceId: string }>;

interface NewProjectPageProps {
  params: Params;
}

export default async function NewProjectPage({ params }: NewProjectPageProps) {
  const { spaceId } = await params;
  const { images = [], videos = [] } = await getSpaceMedia(spaceId);

  return (
    <div className="space-y-6">
      <Heading title="Create Project" description="Create a new project in your space" />
      <ProjectForm spaceId={spaceId} availableImages={images} availableVideos={videos} />
    </div>
  );
}
