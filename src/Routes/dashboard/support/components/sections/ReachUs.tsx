import React from "react";
import { motion } from "framer-motion";
import { LuMail } from "react-icons/lu";
import { FaXTwitter } from "react-icons/fa6";
import { TbPhoneCall } from "react-icons/tb";

const ReachUs: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mt-4"
    >
      <main className=" mt-6 flex gap-[40px]">
        <a href="mailto:support@wano.app">
          <section className="flex gap-3">
            <span className=" border border-[#E5E5E5] p-2 rounded-md cursor-pointer">
              <LuMail className=" text-base text-[rgba(41,45,50,1)]" />
            </span>
            <div>
              <p className=" text-sm font-medium text-[#121212] ">Mail Us</p>

              <p className=" text-xs font-normal text-[#7F7F81]">
                Send us a mail, we’re here to help
              </p>
            </div>
          </section>
        </a>
        <a href="https://x.com/wanohq">
          <section className="flex gap-3">
            <span className=" border border-[#E5E5E5] p-2 rounded-md cursor-pointer">
              <FaXTwitter className=" text-base text-[rgba(41,45,50,1)]" />
            </span>
            <div>
              <p className=" text-sm font-medium text-[#121212] ">
                Follow us on X
              </p>

              <p className=" text-xs font-normal text-[#7F7F81]">
                Follow us for service announcements.
              </p>
            </div>
          </section>
        </a>
      </main>
    </motion.div>
  );
};

export default React.memo(ReachUs);
