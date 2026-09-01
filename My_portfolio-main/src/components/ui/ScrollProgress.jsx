import { useEffect, useState } from 'react';
import { useScene } from '../../context/useScene';
import '../../styles/ScrollProgress.scss';

/**
 * ScrollProgress Component
 *
 * A thin progress indicator at the very top of the viewport.
 * Reflects the current location (corridor vs room) and shows a
 * progress fill that animates on room transitions / teleports.
 */
const ScrollProgress = () => {
    const { currentRoom, isInRoom, isTeleporting } = useScene();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (isInRoom) {
            setProgress(100);
        } else {
            setProgress(0);
        }
    }, [isInRoom]);

    useEffect(() => {
        if (isTeleporting) {
            // Pulse slightly during teleport for a living feel
            setProgress(60);
            const t = setTimeout(() => setProgress(100), 400);
            return () => clearTimeout(t);
        }
    }, [isTeleporting]);

    const label = isInRoom
        ? (currentRoom ? currentRoom.toUpperCase() : 'ROOM')
        : 'CORRIDOR';

    return (
        <div className="scroll-progress" role="presentation" aria-hidden="true">
            <div className="scroll-progress__fill" style={{ width: `${progress}%` }} />
            <span className="scroll-progress__label">{label}</span>
        </div>
    );
};

export default ScrollProgress;
