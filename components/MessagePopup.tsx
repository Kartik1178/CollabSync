import { useState, useEffect } from "react";
import { X } from "lucide-react";

type ProjectRequest = {
  _id: string;
  message: string;
  technologies: string[];
  project: {
    _id: string;
    name: string;
  };
  user: {
    _id: string;
    name: string;
  };
};

export default function MessagePopup({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch("http://localhost:5000/projects/user/requests", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch requests");
          return res.json();
        })
        .then((data) => setRequests(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);
  

  const handleAccept = async (request: ProjectRequest) => {
    try {
      await fetch(
        `http://localhost:5000/projects/api/${request.project._id}/requests/${request.user._id}/accept`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      setRequests((prev) => prev.filter((r) => r._id !== request._id));
    } catch (err) {
      console.error("Error accepting request:", err);
    }
  };

  const handleReject = async (request: ProjectRequest) => {
    try {
      await fetch(
        `http://localhost:5000/projects/api/${request.project._id}/requests/${request.user._id}/reject`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      setRequests((prev) => prev.filter((r) => r._id !== request._id));
    } catch (err) {
      console.error("Error rejecting request:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-[#121212] border border-purple-500/50 rounded-md w-full max-w-md m-4 shadow-lg shadow-purple-500/20 overflow-hidden cyber-card">
        <div className="flex justify-between items-center p-4 border-b border-purple-500/30 bg-[#0a0a0a]">
          <h2 className="text-xl font-bold text-purple-400">Project Requests</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-purple-300">Loading...</div>
          ) : requests.length > 0 ? (
            requests.map((request) => (
              <div
                key={request._id}
                className="p-4 border-b border-purple-500/10 hover:bg-purple-900/10"
              >
                <div className="flex justify-between">
                  <h3 className="font-medium text-purple-300">
                    {request.project.name}
                  </h3>
                  <span className="text-xs text-gray-400">
                    From: {request.user.name}
                  </span>
                </div>
    

                <div className="flex flex-wrap gap-2 my-2">
                  {request.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs bg-purple-900/40 border border-purple-500/30 px-2 py-1 rounded-full text-purple-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 mt-3 justify-end">
                  <button
                    onClick={() => handleReject(request)}
                    className="px-3 py-1 text-sm bg-red-900/20 text-red-400 border border-red-500/30 rounded hover:bg-red-800/30 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleAccept(request)}
                    className="px-3 py-1 text-sm bg-green-900/20 text-green-400 border border-green-500/30 rounded hover:bg-green-800/30 transition-colors"
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-400">
              No pending requests
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
