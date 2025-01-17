"use client"

import * as React from "react"
import axios from 'axios'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { RefreshCw, ArrowUpDown, ChevronDown, MoreHorizontal, UserPlus, Settings, Edit, Trash2, ArrowDownAZ, Clock, Download } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import ScholarDetails from "@/app/Dashboard/dash components/scholar-bar-chart"
import { debounce } from 'lodash'

interface Scholar {
  _id: string;
  name: string;
  axieId: string;
  share: {
    manager: number;
    scholar: number;
  };
  winrate: number;
  slp: number;
  axs: number;
  totalSLP: number;
  totalMoonshard: number;
  rank: number;
  createdAt?: string;
}

interface BattleLog {
  date: string;
  uuid: string;
  gameMode: string;
  startedAt: string;
  endedAt: string;
  winner: number;
  players: any[];
  rewardMeta: any;
}

export function DataTableDemo() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    axieId: false,
  })
  const [rowSelection, setRowSelection] = React.useState({})
  const [isOpen, setIsOpen] = React.useState(false)
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    axieId: '',
    managerShare: '',
    scholarShare: '0',
  })
  const [battleLogs, setBattleLogs] = React.useState<BattleLog[]>([])
  const [scholars, setScholars] = React.useState<Scholar[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [selectedScholar, setSelectedScholar] = React.useState<Scholar | null>(null)
  const [isFetchingLogs, setIsFetchingLogs] = React.useState(false)
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [sortConfig, setSortConfig] = React.useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [hasMoreLogs, setHasMoreLogs] = React.useState(true)
  const [refreshingScholars, setRefreshingScholars] = React.useState<Set<string>>(new Set())
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editFormData, setEditFormData] = React.useState({
    firstName: '',
    lastName: '',
    managerShare: '',
  });

  React.useEffect(() => {
    fetchScholars()
  }, [])

  const fetchScholars = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get('/api/scholars')
      setScholars(response.data)
    } catch (error) {
      console.error('Error fetching scholars:', error)
      alert('Failed to fetch scholars. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => {
      const newData = { ...prev, [name]: value }
      if (name === 'managerShare') {
        const managerShare = parseInt(value) || 0
        newData.scholarShare = (100 - managerShare).toString()
      }
      if (name === 'axieId') {
        newData.axieId = value
      }
      return newData
    })
  }

  const fetchBattleLogs = async (axieId: string, page: number = 1) => {
    setIsFetchingLogs(true);
    try {
      console.log('Fetching battle logs for Axie ID:', axieId, 'Page:', page);
      const response = await axios.post('/api/add-battle-logs', {
        axieId,
        page
      });
      console.log('Battle Logs Response:', JSON.stringify(response.data));
      if (response.data.battleLogs && Object.keys(response.data.battleLogs).length > 0) {
        const processedLogs = Object.entries(response.data.battleLogs).flatMap(([date, logs]) =>
          (logs as any[]).map((log: any) => ({
            date,
            uuid: log.uuid,
            gameMode: log.gameMode,
            startedAt: new Date(log.startedAt).toLocaleString(),
            endedAt: new Date(log.endedAt).toLocaleString(),
            winner: log.winner,
            players: log.players,
            rewardMeta: log.rewardMeta
          }))
        );

        if (JSON.stringify(processedLogs) !== JSON.stringify(battleLogs)) {
          setBattleLogs(prevLogs => [...prevLogs, ...processedLogs]);
          setHasMoreLogs(page < response.data.totalPages);

          // Update scholar with new data
          setScholars(prevScholars =>
            prevScholars.map(s =>
              s.axieId === axieId ? { 
                ...s, 
                ...response.data.updatedScholar, 
                totalSLP: response.data.updatedScholar.totalSLP,
                totalMoonshard: response.data.updatedScholar.totalMoonshard,
                winrate: response.data.updatedScholar.winrate
              } : s
            )
          );

          // Update SLP distribution
          const updatedScholar = response.data.updatedScholar;
          await updateSLPDistribution(updatedScholar._id, updatedScholar.totalSLP);
        }

        return processedLogs;
      } else {
        console.warn('No battle logs found');
        setHasMoreLogs(false);
        return [];
      }
    } catch (error) {
      console.error('Error fetching battle logs:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response:', error.response.data);
        if (error.response.status === 404) {
          alert('No battle logs found for this Axie ID. Please check if the Axie ID is correct.');
        } else {
          alert(`Error: ${error.response.data.error || 'Failed to fetch battle logs'}`);
        }
      } else {
        alert('An unexpected error occurred while fetching battle logs');
      }
      setHasMoreLogs(false);
      return null;
    }
    finally {
      setIsFetchingLogs(false);
    }
  };

  const updateSLPDistribution = async (scholarId: string, totalSLP: number) => {
    try {
      const scholar = scholars.find(s => s._id === scholarId);
      if (!scholar) {
        console.error('Scholar not found for ID:', scholarId);
        return;
      }

      const managerShare = scholar.share.manager;
      const scholarShare = scholar.share.scholar;

      const response = await axios.post('/api/slp-distribution', {
        scholarId,
        scholarTotalSLP: totalSLP,
        managerShare,
        scholarShare
      });

      console.log('SLP distribution updated:', response.data);
    } catch (error) {
      console.error('Error updating SLP distribution:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true)

    try {
      const scholarData = {
        name: `${formData.firstName} ${formData.lastName}`,
        axieId: formData.axieId,
        share: {
          manager: parseInt(formData.managerShare),
          scholar: parseInt(formData.scholarShare)
        }
      };

      console.log('Submitting scholar data:', scholarData);

      const scholarResponse = await axios.post('/api/scholars', scholarData);
      const scholar = scholarResponse.data.scholar;
      await fetchBattleLogs(scholar.axieId);

      console.log('Scholar saved:', scholar);

      // Update SLP distribution
      await updateSLPDistribution(scholar._id, scholar.totalSLP);

      alert('Scholar added successfully and SLP distribution updated!');
      setIsOpen(false);
      setFormData({
        firstName: '',
        lastName: '',
        axieId: '',
        managerShare: '',
        scholarShare: '0',
      });
      fetchScholars();
    } catch (error) {
      console.error('Error saving data:', error);
      if (axios.isAxiosError(error) && error.response) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false)
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(true);
    try {
      const response = await axios.put(`/api/scholars/${selectedScholar?._id}`, {
        name: `${editFormData.firstName} ${editFormData.lastName}`,
        share: {
          manager: parseInt(editFormData.managerShare),
          scholar: 100 - parseInt(editFormData.managerShare)
        }
      });

      if (response.status === 200) {
        const updatedScholar = response.data.scholar;

        // Update SLP distribution
        await updateSLPDistribution(updatedScholar._id, updatedScholar.totalSLP);

        alert('Scholar updated successfully!');
        setIsEditModalOpen(false);
        fetchScholars();
      }
    } catch (error) {
      console.error('Error updating scholar:', error);
      alert('Failed to update scholar');
    } finally {
      setIsEditing(false);
    }
  };

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      for (const scholar of scholars) {
        setRefreshingScholars(prev => new Set(prev).add(scholar._id));
        await fetchBattleLogs(scholar.axieId, 1);
        setRefreshingScholars(prev => {
          const newSet = new Set(prev);
          newSet.delete(scholar._id);
          return newSet;
        });
      }
      await fetchScholars();
      alert('Data refreshed successfully!');
    } catch (error) {
      console.error('Error refreshing data:', error);
      alert('Failed to refresh data');
    } finally {
      setIsRefreshing(false);
      setRefreshingScholars(new Set());
    }
  };

  const handleSortByName = () => {
    const sortedScholars = [...scholars].sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    setScholars(sortedScholars);
    setSortConfig({ key: 'name', direction: 'asc' });
  };

  const handleSortByTimeAdded = () => {
    const sortedScholars = [...scholars].sort((a, b) => {
      return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
    });
    setScholars(sortedScholars);
    setSortConfig({ key: 'createdAt', direction: 'desc' });
  };

  const columns: ColumnDef<Scholar>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          onChange={() => setSelectedScholar(row.original)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <button
          className="text-blue-600 hover:underline"
          onClick={() => {
            setSelectedScholar(row.original)
            setBattleLogs([])
            setCurrentPage(1)
            setHasMoreLogs(true)
            setIsSheetOpen(true)
            fetchBattleLogs(row.original.axieId)
          }}
        >
          {row.getValue("name")}
        </button>
      ),
    },
    {
      accessorKey: "axieId",
      header: "Axie ID",
      cell: ({ row }) => <div>{row.getValue("axieId")}</div>,
    },
    {
      accessorKey: "share.manager",
      header: "Manager Share",
      cell: ({ row }) => <div>{row.original.share.manager}%</div>,
    },
    {
      accessorKey: "share.scholar",
      header: "Scholar Share",
      cell: ({ row }) => <div>{row.original.share.scholar}%</div>,
    },
    {
      accessorKey: "winrate",
      header: "Win Rate",
      cell: ({ row }) => <div>{row.getValue("winrate") || '0'}%</div>,
    },
    {
      accessorKey: "totalSLP",
      header: "Total SLP",
      cell: ({ row }) => <div>{row.getValue("totalSLP") || '0'}</div>,
    },
    {
      accessorKey: "totalMoonshard",
      header: "Total Moonshard",
      cell: ({ row }) => <div>{row.getValue("totalMoonshard") || '0'}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const scholar = row.original
        const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
        const [editFormData, setEditFormData] = React.useState({
          firstName: scholar.name.split(' ')[0],
          lastName: scholar.name.split(' ')[1] || '',
          managerShare: scholar.share.manager.toString()
        })
        const [isEditing, setIsEditing] = React.useState(false);

        const handleEdit = async (e: React.FormEvent) => {
          e.preventDefault();
          setIsEditing(true);
          try {
            const response = await axios.put(`/api/scholars/${scholar._id}`, {
              name: `${editFormData.firstName} ${editFormData.lastName}`,
              share: {
                manager: parseInt(editFormData.managerShare),
                scholar: 100 - parseInt(editFormData.managerShare)
              }
            });

            if (response.status === 200) {
              const updatedScholar = response.data.scholar;

              // Update SLP distribution
              await updateSLPDistribution(updatedScholar._id, updatedScholar.totalSLP);

              alert('Scholar updated successfully!');
              setIsEditModalOpen(false);
              fetchScholars();
            }
          } catch (error) {
            console.error('Error updating scholar:', error);
            alert('Failed to update scholar');
          } finally {
            setIsEditing(false);
          }
        };

        const handleDelete = async () => {
          if (window.confirm('Are you sure you want to delete this scholar? This will also delete all associated battle logs.')) {
            try {
              const response = await axios.delete(`/api/scholars/${scholar._id}`);
              if (response.status === 200) {
                alert('Scholar deleted successfully!');
                fetchScholars();
              }
            } catch (error) {
              console.error('Error deleting scholar:', error);
              alert('Failed to delete scholar');
            }
          }
        };

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Scholar</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleEdit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="edit-firstName">First Name</Label>
                      <Input
                        id="edit-firstName"
                        value={editFormData.firstName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditFormData(prev => ({
                          ...prev,
                          firstName: e.target.value
                        }))}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="edit-lastName">Last Name</Label>
                      <Input
                        id="edit-lastName"
                        value={editFormData.lastName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditFormData(prev => ({
                          ...prev,
                          lastName: e.target.value
                        }))}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="edit-managerShare">Manager Share (%)</Label>
                    <Input
                      id="edit-managerShare"
                      type="number"
                      min="0"
                      max="100"
                      value={editFormData.managerShare}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditFormData(prev => ({
                        ...prev,
                        managerShare: e.target.value
                      }))}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isEditing}>
                    {isEditing ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </>
        )
      },
    },
  ]

  const table = useReactTable({
    data: scholars,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  React.useEffect(() => {
    const revalidationInterval = setInterval(() => {
      handleRefreshData();
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(revalidationInterval);
  }, [scholars]);

  const settingsDropdown = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto px-[.5rem] h-[33px] drop-shadow-[0_2px_2px_gray]">
          <Settings className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={handleRefreshData}
          disabled={isRefreshing}
          className={isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSortByName}>
          <ArrowDownAZ className="mr-2 h-4 w-4" />
          Sort by Name
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSortByTimeAdded}>
          <Clock className="mr-2 h-4 w-4" />
          Sort by Time Added
        </DropdownMenuItem>
        {/* <DropdownMenuItem onSelect={() => console.log('Export')}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const tableContent = (
    <TableBody className="text-[11px]">
      {isRefreshing ? (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            <div className="flex items-center justify-center space-x-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Refreshing data...</span>
            </div>
          </TableCell>
        </TableRow>
      ) : table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            data-state={row.getIsSelected() && "selected"}
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {refreshingScholars.has(row.original._id) ? (
                  <div className="flex items-center justify-center">
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    <span>Refreshing...</span>
                  </div>
                ) : (
                  flexRender(cell.column.columnDef.cell, cell.getContext())
                )}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            {isLoading ? 'Loading...' : 'No results.'}
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );

  const loadMoreLogs = async () => {
    if (selectedScholar && hasMoreLogs) {
      setCurrentPage(prevPage => prevPage + 1);
      await fetchBattleLogs(selectedScholar.axieId, currentPage + 1);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Filter names..."
          onChange={React.useMemo(
            () => debounce((event) => {
              table.getColumn("name")?.setFilterValue(event.target.value);
            }, 300),
            [table]
          )}
          className="h-[33px] drop-shadow-[0_2px_2px_gray]"
        />
        <div className="flex flex-row items-center gap-2 ml-auto">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="ml-auto px-[.5rem] h-[33px] drop-shadow-[0_2px_2px_gray]">
                <UserPlus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="items-center">
                <DialogTitle className="font-bold">Add New Scholar</DialogTitle>
                <p className="text-[11px]">Provide a valid input below.</p>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="axieId">Axie ID</Label>
                  <Input
                    id="axieId"
                    name="axieId"
                    value={formData.axieId}
                    onChange={handleInputChange}
                    required
                    title="Please enter a valid Axie ID"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="managerShare">Manager Share (%)</Label>
                  <Input
                    id="managerShare"
                    name="managerShare"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.managerShare}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="scholarShare">Scholar Share (%)</Label>
                  <Input
                    id="scholarShare"
                    name="scholarShare"
                    value={formData.scholarShare}
                    readOnly
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Adding...' : 'Add Scholar'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          {settingsDropdown}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto px-[.5rem] h-[33px] drop-shadow-[0_2px_2px_gray]">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="bg-white text-black rounded-md drop-shadow-[0_0_2px_gray]">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-black">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          {tableContent}
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="drop-shadow-[0_2px_2px_gray]"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="drop-shadow-[0_2px_2px_gray]"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="min-w-[50%] sm:w-[540px] lg:w-[640px] overflow-x-scroll">
          <SheetHeader>
            <SheetTitle>Scholar Details: {selectedScholar?.name}</SheetTitle>
          </SheetHeader>
          <div className="py-6">
            {selectedScholar && (
              <ScholarDetails
                scholar={selectedScholar}
                battleLogs={battleLogs}
                onLoadMore={loadMoreLogs}
                hasMoreLogs={hasMoreLogs}
                isLoading={isFetchingLogs}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      {isFetchingLogs && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg flex items-center space-x-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Fetching New Data...</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTableDemo;

