import { useState } from 'react';
import { Button } from "@/components/ui/button"; // Adjust as per your UI component library

interface Props {
  projectId: string;
  onDelete: () => void; // Function to refresh UI or redirect after deletion
}

const DeleteProjectButton = ({ projectId, onDelete }: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteProject = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/projects/${projectId}`, {
        method: 'DELETE',
        credentials: 'include', // Send the cookies with the request
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete project');
      }

      onDelete(); // This will handle UI update (like removing project from the list or redirecting)
    } catch (err) {
      setError((err as Error).message);
      console.error('Error deleting project:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}
      <Button 
        variant="destructive" 
        onClick={handleDeleteProject} 
        disabled={loading}
      >
        {loading ? 'Deleting...' : 'Delete Project'}
      </Button>
    </div>
  );
};

export default DeleteProjectButton;
