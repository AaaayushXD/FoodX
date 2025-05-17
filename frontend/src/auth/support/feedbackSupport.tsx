import { useFeedbackFn } from "@/hooks";
import { Icons } from "@/utils";

export const FeedbackSupport = () => {
  const {
    feedback,
    feedbackType,
    mutate,

    setFeedback,
    setFeedbackType,
    setRating,
  } = useFeedbackFn();

  return (
    <div className="w-full sm:p-6 py-20 px-2 bg-white flex flex-col items-center justify-center gap-7 sm:gap-16">
      <form
        onSubmit={mutate}
        className="w-full max-w-xl rounded-lg space-y-3 sm:space-y-6"
      >
        <div className="w-full flex flex-col">
          <h1 className="sm:text-2xl text-[18px] font-bold text-gray-800 dark:text-white text-center">
            Your Opinion Matters!
          </h1>
          <p className="sm:text-sm text-xs text-gray-600 dark:text-gray-400 text-center">
            Help us improve by sharing your experience.
          </p>
        </div>

        {/* Feedback Type */}
        <div>
          <label
            htmlFor="type"
            className="block text-gray-700 dark:text-gray-300"
          >
            Feedback Type
          </label>
          <select
            required
            id="type"
            value={feedbackType}
            onChange={(e) => setFeedbackType(e.target.value)}
            className="w-full mt-1 outline-none px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
            <option value="" disabled>
              Select type
            </option>
            <option value="Bug Report">Bug Report</option>
            <option value="Feature Request">Feature Request</option>
            <option value="General Feedback">General Feedback</option>
          </select>
        </div>

        {/* Feedback Comment */}
        <div>
          <label
            htmlFor="feedback"
            className="block text-gray-700 dark:text-gray-300"
          >
            Your Feedback
          </label>
          <textarea
            required
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full outline-none mt-1 px-4 py-2 border rounded-md h-32 resize-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => {
              setRating(0);
              setFeedback("");
              setFeedbackType("");
            }}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md"
          >
            Clear Form
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] text-white rounded-md"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

{
  /* Rating Section */
}
//   <div className="flex justify-center items-center gap-2">
//   {[...Array(5)].map((_, index) => (
//     <button
//       type="button"
//       key={index}
//       className={`text-2xl
//       `}
//       onClick={() => setRating(index + 1)}
//     >
//       <Icons.star
//         className={` ${
//           rating > index
//             ? "fill-yellow-500 text-yellow-500 "
//             : "fill-gray-300 text-gray-300 "
//         }`}
//       />
//     </button>
//   ))}
// </div>
