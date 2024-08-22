import { useEffect, useState } from 'react';
import { CampaignInterface } from '../../utils/interfaces';
import DefaultImage from '../../assets/morning_forest.jpg';
import { IoIosPerson } from 'react-icons/io';
import { TbClockHour4 } from 'react-icons/tb';
import { BsDot } from 'react-icons/bs';

const CampaignCard: React.FC<CampaignInterface> = ({
  author,
  title,
  description,
  targetFund,
  currentFund,
  totalParticipant,
  dueDate,
}) => {
  const getFundPercentage = () => {
    return (currentFund / targetFund) * 100;
  };
  const fundPercentage = getFundPercentage();
  const changeDatetime = () => {
    const date = new Date();
    const currentDate = Math.floor(date.getTime() / 1000);
    const formattedDueDate = Math.floor(new Date(dueDate).getTime() / 1000);
    const result = Math.floor((formattedDueDate - currentDate) / 86400);
    return result;
  };
  const [time, setTime] = useState(changeDatetime());
  const [descriptions, setDescriptions] = useState<string>(description);
  useEffect(() => {
    const cutDescription = () => {
      if (description.length > 100) {
        setDescriptions(description.slice(0, 100) + '...');
      }
      setDescriptions(description);
    };
    cutDescription();
  }, []);
  return (
    <button className="bg-secondary hover:cursor-pointer w-[18rem] h-[20rem] shadow-md hover:shadow-lg transition hover:shadow-gray-500 shadow-gray-400 rounded-lg flex flex-col text-sm">
      <div className="aspect-w-16 aspect-h-10">
        <img
          src={DefaultImage}
          alt="campaign"
          className="object-cover w-full h-full rounded-t-lg"
        />
      </div>
      <div className="justify-between flex flex-col p-2 text-start">
        <div className="justify-between flex flex-row items-center">
          <div className="text-xl font-semibold">{title}</div>
          <div className="flex flex-row">
            <IoIosPerson />
            <div className="text-xs ml-2 font-semibold">{totalParticipant}</div>
          </div>
        </div>
        <div className="text-xs font-semibold text-grays">{author}</div>
        <div className="flex flex-row items-center">
          <TbClockHour4 className=" mt-1" />
          {time === 0 ? (
            <div className="text-sm mx-1 font-semibold ">{time} days left</div>
          ) : (
            <div className="text-sm mx-1 font-semibold ">
              Less than 24 hours left
            </div>
          )}
          <BsDot className="mt-1" />
          <div className="text-sm mx-1 font-semibold ">
            {fundPercentage}% Funded
          </div>
        </div>
        <p className="text-xs font-normal justify-between">{descriptions}</p>
      </div>
    </button>
  );
};

export default CampaignCard;
