interface QueueItem {
  onStart: () => Promise<void>;
  onEnd?: () => void;
}

export const createQueue = (maxConcurrent: number, onFinish: (err: Error | null) => void) => {
  const queue: QueueItem[] = [];

  const enqueue = (task: QueueItem) => {
    queue.push(task);
  };

  let processing = 0;
  let canceled = false;
  const dequeue = () => {
    if (processing < maxConcurrent) {
      const item = queue.shift();
      if (item) {
        processing++;
        item
          .onStart()
          .then(() => {
            item.onEnd?.();
            processing--;
            if (canceled) return;
            dequeue();
          })
          .catch((err) => {
            canceled = true;
            onFinish(err);
          });
      } else if (!processing) {
        onFinish(null);
      }
    }
  };
  
  const start = () => {
    for (let i = 0; i < maxConcurrent; i++) {
      dequeue();
    }
  };

  return { enqueue, dequeue, start };
};
