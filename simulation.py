from hw3 import *
import matplotlib.pyplot as plt

if __name__ == '__main__':
    infection_curve = sim('hw3.cfg')
    print("Infection Curve:", infection_curve)

import matplotlib.pyplot as plt

if __name__ == '__main__':
    infection_curve = sim('hw3.cfg')
    days = range(len(infection_curve))
    plt.figure(figsize=(10, 6))
    plt.plot(days, infection_curve, marker='o')
    plt.title('Infection Curve Over Time')
    plt.xlabel('Day')
    plt.ylabel('Number of Infections')
    plt.grid(True)
    plt.show()
