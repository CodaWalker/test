import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { FilterModalProps } from "@/lib/types";

const FilterModal = ({ isOpen, filters, onClose, onApply, onReset }: FilterModalProps) => {
  const [localFilters, setLocalFilters] = useState(filters);
  
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
    }
  }, [isOpen, filters]);

  const handleInterestToggle = (interest: string) => {
    setLocalFilters(prev => {
      const newInterests = prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest];
      
      return { ...prev, interests: newInterests };
    });
  };

  const handleBudgetChange = (values: number[]) => {
    setLocalFilters(prev => ({
      ...prev,
      budget: { min: values[0], max: values[1] }
    }));
  };

  const handleDurationChange = (values: number[]) => {
    setLocalFilters(prev => ({
      ...prev,
      duration: { min: values[0], max: values[1] }
    }));
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    onReset();
    onClose();
  };

  if (!isOpen) return null;

  const formatDate = (date: Date | null) => {
    return date ? format(date, "MMM d, yyyy") : "Select";
  };

  const interestsList = [
    "Beach", "Culture", "Food", "Nightlife", "Adventure", "History", "Shopping", "Nature",
    "Architecture", "Art", "Relaxation", "Romantic", "Family", "Urban", "Wildlife", "Winter"
  ];

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-30 bg-black/50 flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="m-4 max-w-md w-full bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b dark:border-neutral-700 flex justify-between items-center">
              <h3 className="font-semibold text-lg dark:text-white">Filters</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700"
              >
                <X className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />
              </Button>
            </div>
            
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {/* Date Range */}
              <div className="mb-4">
                <h4 className="font-medium text-sm mb-2 dark:text-white">Travel Dates</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <span className="text-xs">{formatDate(localFilters.dates.start)}</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={localFilters.dates.start as Date}
                          onSelect={(date) => 
                            setLocalFilters(prev => ({
                              ...prev,
                              dates: { ...prev.dates, start: date }
                            }))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <span className="text-xs">{formatDate(localFilters.dates.end)}</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={localFilters.dates.end as Date}
                          onSelect={(date) => 
                            setLocalFilters(prev => ({
                              ...prev,
                              dates: { ...prev.dates, end: date }
                            }))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
              
              {/* Budget Range */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-sm dark:text-white">Budget</h4>
                  <span className="text-xs text-neutral-600 dark:text-neutral-400">
                    ${localFilters.budget.min} - ${localFilters.budget.max}
                  </span>
                </div>
                <Slider
                  defaultValue={[localFilters.budget.min, localFilters.budget.max]}
                  min={100}
                  max={5000}
                  step={100}
                  onValueChange={handleBudgetChange}
                />
              </div>
              
              {/* Duration */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-sm dark:text-white">Trip Duration</h4>
                  <span className="text-xs text-neutral-600 dark:text-neutral-400">
                    {localFilters.duration.min} - {localFilters.duration.max} days
                  </span>
                </div>
                <Slider
                  defaultValue={[localFilters.duration.min, localFilters.duration.max]}
                  min={1}
                  max={30}
                  step={1}
                  onValueChange={handleDurationChange}
                />
              </div>
              
              {/* Interests */}
              <div className="mb-4">
                <h4 className="font-medium text-sm mb-2 dark:text-white">Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {interestsList.map(interest => (
                    <Button
                      key={interest}
                      variant="outline"
                      size="sm"
                      className={`
                        rounded-full text-xs px-3 py-1.5 h-auto
                        ${localFilters.interests.includes(interest) 
                          ? "bg-primary/10 text-primary border-primary/20" 
                          : ""}
                      `}
                      onClick={() => handleInterestToggle(interest)}
                    >
                      {interest}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Destinations */}
              <div className="mb-4">
                <h4 className="font-medium text-sm mb-2 dark:text-white">Destinations</h4>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search destinations..."
                    className="pl-8"
                  />
                  <span className="absolute left-3 top-2.5 text-neutral-400 text-sm">🔍</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    Europe
                    <button className="text-xs ml-1">✕</button>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    Beach Destinations
                    <button className="text-xs ml-1">✕</button>
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t dark:border-neutral-700 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleReset}
              >
                Reset
              </Button>
              <Button
                onClick={handleApply}
              >
                Apply Filters
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default FilterModal;
