import { useNavigate, useSearchParams } from "react-router-dom";

const DestinationReachedButton = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const loanId = params.get("loanId");

  const handleClick = () => {
    navigate(`/dashboard/money-exchange?loanId=${loanId}`);
  };

  return (
    <div className="mt-4 flex justify-center">
      <button
        onClick={handleClick}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl shadow-md"
      >
        ✅ Destination Reached - Proceed
      </button>
    </div>
  );
};

export default DestinationReachedButton;
