import { ProjectActions } from '@/components/projects/project-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface Project {
  id: string;
  contentId: string;
  year: number | null;
  title: string | null;
  description: string | null;
  status: 'draft' | 'published' | 'archived' | null;
  createdAt: Date;
}

interface ProjectGridProps {
  projects: Project[];
  spaceId: string;
  error?: string;
}

export function ProjectGrid({ projects, spaceId, error }: ProjectGridProps) {
  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (projects.length === 0) {
    return <p className="text-muted-foreground">No projects found. Create your first project!</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card key={project.id} className="group relative">
          <Link href={`/dashboard/${spaceId}/projects/${project.id}`} className="block">
            <CardHeader>
              <CardTitle>{project.title || 'Untitled Project'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {project.description || 'No description'}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm">{project.year || project.createdAt.getFullYear()}</span>
                <span className="text-sm text-muted-foreground">•</span>
                <span
                  className={`text-sm ${
                    project.status === 'published' ? 'text-green-500' : 'text-yellow-500'
                  }`}
                >
                  {project.status}
                </span>
              </div>
            </CardContent>
          </Link>
          <ProjectActions
            spaceId={spaceId}
            contentId={project.contentId}
            projectTitle={project.title || 'Untitled Project'}
          />
        </Card>
      ))}
    </div>
  );
}
