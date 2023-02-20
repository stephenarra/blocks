import { useEffect, useState } from "react";

interface DoubleClickProps {
  delay?: number;
  onSingleClick: () => void;
  onDoubleClick: () => void;
}

const useDoubleClick = ({
  onSingleClick,
  onDoubleClick,
  delay = 250,
}: DoubleClickProps) => {
  const [click, setClick] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (click === 1) onSingleClick();
      setClick(0);
    }, delay);

    if (click === 2) onDoubleClick();

    return () => clearTimeout(timer);
  }, [click]); // eslint-disable-line

  return () => setClick((prev) => prev + 1);
};

export default useDoubleClick;
