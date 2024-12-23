import { IAgent } from '@/types/agent.types';
import { Application } from '@/types/applications.types';
import { useNavigate } from 'react-router-dom';

const AssistantCard: React.FC<{ assistant: Application }> = ({ assistant }) => {
    const navigate = useNavigate();
  
    return (
      <div className="assistant-card" onClick={() => navigate(`/dashboard/assistant/${assistant.id}`)}>
        <div className="assistant-card-header">
          <h3>{assistant.name}</h3>
          <span className={`status-badge ${assistant.deactivated ? 'inactive' : 'active'}`}>{assistant.deactivated ? 'inactive' : 'active'}</span>
        </div>
        <p className="assistant-description">{assistant.description}</p>
        <div className="assistant-details">
          <span>Model: {assistant.personality_type}</span>
          <span>Type: {assistant.type}</span>
        </div>
      </div>
    );
  };

export default AssistantCard;