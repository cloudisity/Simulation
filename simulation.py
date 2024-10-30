from hw3 import *
import matplotlib.pyplot as plt

def main():
    # Read the configuration file
    config = readConfig('hw3.cfg')
    # Run the simulation
    infection_curve = sim(config)
    print("Infection Curve:", infection_curve)

    # Plot the infection curve
    days = range(len(infection_curve))
    plt.figure(figsize=(10, 6))
    plt.plot(days, infection_curve, marker='o')
    plt.title('Infection Curve Over Time')
    plt.xlabel('Day')
    plt.ylabel('Number of Infections')
    plt.grid(True)
    plt.show()

if __name__ == '__main__':
    main()
