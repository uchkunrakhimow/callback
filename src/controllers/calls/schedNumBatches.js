const moment = require("moment-timezone");
const { v4: uuidv4 } = require("uuid");

// Function to calculate the completion percentage
const calculatePercentage = (completed, total) => (completed / total) * 100;

// Function to get the next Monday's date
const getNextMonday = (currentDate) => {
  const daysUntilNextMonday = (1 + 7 - currentDate.day()) % 7;
  return currentDate.clone().add(daysUntilNextMonday, "days").startOf("day");
};

// Function to get the next minute's time
const getNextMinuteTime = (currentDate) =>
  currentDate.clone().add(1, "minute").startOf("minute").valueOf();

const runningUUIDs = new Map(); // Define a map to track running UUIDs and their corresponding intervals

// Function to stop the lifecycle of a specific UUID
const stopBatchByUUID = (uuid) => {
  if (runningUUIDs.has(uuid)) {
    clearInterval(runningUUIDs.get(uuid));
    runningUUIDs.delete(uuid);
  }
};

// Main scheduling function
const schedNumBatches = (
  rangeNumbers,
  numCalls,
  includeSaturday,
  includeFriday,
  betweenAttempts,
  handleRes,
  handlePercentage,
) => {
  try {
    let numbersInRange = [];
    const uniqueId = uuidv4();

    // Check if the input rangeNumbers is an array or string
    if (Array.isArray(rangeNumbers)) {
      numbersInRange = rangeNumbers;
    } else if (typeof rangeNumbers === "string") {
      const match = rangeNumbers.match(/(\d+)-(\d+)/);

      if (match) {
        const [start, end] = match.slice(1).map(Number);

        if (!isNaN(start) && !isNaN(end) && start < end) {
          numbersInRange = Array.from(
            { length: end - start + 1 },
            (_, i) => start + i,
          );
        }
      } else {
        const singleNumber = parseInt(rangeNumbers);
        if (!isNaN(singleNumber)) {
          numbersInRange = [singleNumber];
        }
      }
    }

    // If there are no numbers in the range, handle and return
    if (numbersInRange.length === 0) {
      handleRes([]);
      return [];
    }

    // Get the current date and time in the "Asia/Tashkent" timezone
    const currentDate = moment.tz("Asia/Tashkent");
    const currentDay = currentDate.day();
    const currentHour = currentDate.hours();

    // Define working hours
    const startWorkingHour = 9;
    const endWorkingHour = 21;

    // Check if the current time is within working hours
    const isWithinWorkingHours = () =>
      currentHour >= startWorkingHour && currentHour < endWorkingHour;

    // Update the progress based on completed calls
    const handleProgress = (completed) => {
      const totalCalls = numCalls * Math.ceil(numbersInRange.length / numCalls);
      const percentage = Math.min(
        Math.ceil(calculatePercentage(completed, totalCalls)),
        100,
      );
      handlePercentage(percentage, uniqueId);
    };

    // Schedule the next batch to run after the next minute
    const scheduleNextBatch = () => {
      const timeUntilNextMinute = getNextMinuteTime(currentDate) - currentDate;
      setTimeout(() => {
        schedNumBatches(
          rangeNumbers,
          numCalls,
          includeSaturday,
          includeFriday,
          betweenAttempts,
          handleRes,
          handlePercentage,
        );
      }, timeUntilNextMinute);
    };

    // Check conditions for scheduling based on days and working hours
    if (!includeSaturday && !includeFriday) {
      if (!isWithinWorkingHours()) {
        const timeUntilNextDay = getNextMonday(currentDate).diff(currentDate);
        setTimeout(scheduleNextBatch, timeUntilNextDay);
        return [];
      }
    } else if (
      (includeSaturday && includeFriday) ||
      (currentDay === 0 && !includeFriday) ||
      (currentDay === 6 && !includeSaturday)
    ) {
      handleRes([]);
      return [];
    }

    // Initial batch and progress handling
    const res = numbersInRange.slice(0, numCalls);
    handleRes(res);
    handleProgress(res.length);

    let currentIndex = numCalls;

    // Set up an interval to handle subsequent batches
    const interval = setInterval(() => {
      if (currentIndex >= numbersInRange.length) {
        clearInterval(interval);

        runningUUIDs.delete(uniqueId); // Remove the UUID from the map when the batch is completed
        return;
      }

      const nextNumbers = numbersInRange.slice(
        currentIndex,
        currentIndex + numCalls,
      );
      currentIndex += numCalls;

      handleRes(nextNumbers);
      handleProgress(currentIndex, uniqueId);
    }, moment.duration(betweenAttempts, "minutes").asMilliseconds());

    runningUUIDs.set(uniqueId, interval); // Store the interval with its UUID

    return [];
  } catch (err) {
    return [];
  }
};

module.exports = { schedNumBatches, stopBatchByUUID };
