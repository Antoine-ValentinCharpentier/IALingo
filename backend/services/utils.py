import random

def choose_values(lst, predefined_value):
   
    lst_without_predefined = [val for val in lst if val != predefined_value]
    lst_without_duplicates = list(set(lst_without_predefined))
    
    chosen_values = random.sample(lst_without_duplicates, 4)
    
    chosen_values.append(predefined_value)
    
    random.shuffle(chosen_values)
    
    return chosen_values
